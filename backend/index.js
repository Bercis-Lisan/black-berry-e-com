require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const connectDB = require("./config/db");
const Order = require("./models/Order");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

const router = express.Router();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

connectDB();




/**
 * @route   POST /api/payment/create-order
 * @body    { amount: Number (in rupees) }
 */
router.post("/create-order", async (req, res) => {
  try {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured",
      });
    }

    const { amount, currency = "INR" } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // rupees -> paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

/**
 * @route   POST /api/payment/verify
 * @body    { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, items?, uid?, email? }
 */
router.post("/verify", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      items,
      uid,
      email,
      customer,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (
      !customer?.fullName ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address?.line1 ||
      !customer?.address?.city ||
      !customer?.address?.state ||
      !customer?.address?.postalCode ||
      !customer?.address?.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete contact and delivery details are required",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Record the sale for the admin dashboard (skipped silently if MongoDB isn't connected)
    try {
      await Order.create({
        razorpay_order_id,
        razorpay_payment_id,
        amount: amount || 0,
        items: items || [],
        customer,
        userUid: uid || null,
        userEmail: customer.email || email || null,
        status: "paid",
      });
    } catch (dbErr) {
      console.error("order save error:", dbErr.message);
      return res.status(500).json({
        success: false,
        message: "Payment verified, but order details could not be saved. Contact support before retrying payment.",
      });
    }

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("verify error:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/payment", router);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));