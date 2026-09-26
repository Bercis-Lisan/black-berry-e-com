const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: addressSchema, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    amount: { type: Number, required: true }, // in rupees
    currency: { type: String, default: "INR" },
    items: { type: [orderItemSchema], default: [] },
    customer: { type: customerSchema, required: true },
    userUid: { type: String, default: null },
    userEmail: { type: String, default: null },
    status: { type: String, enum: ["paid", "failed"], default: "paid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
