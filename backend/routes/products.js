const express = require("express");
const Product = require("../models/Product");

const router = express.Router();
const MAX_IMAGE_DATA_URL_BYTES = 4.2 * 1024 * 1024;

function isSupportedImage(image) {
  if (typeof image !== "string" || !image.trim()) return false;
  if (/^https?:\/\/\S+$/i.test(image)) return true;
  if (!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image)) {
    return false;
  }
  return Buffer.byteLength(image, "utf8") <= MAX_IMAGE_DATA_URL_BYTES;
}

// GET /api/products — public, used by the storefront to list DB-added products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("list products error:", err);
    res.status(500).json({ success: false, message: "Could not fetch products" });
  }
});

// POST /api/products — public product creation
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      tag,
      rating,
      reviews,
      colors,
      variants,
      image,
      description,
      specs,
    } = req.body;

    if (!name || !category || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "name, category, price and image are required",
      });
    }

    if (!isSupportedImage(image)) {
      return res.status(400).json({
        success: false,
        message: "Image must be a URL or a JPEG, PNG, or WebP image up to 3 MB",
      });
    }

    if (
      !Array.isArray(colors) ||
      new Set(colors.filter((color) => typeof color === "string" && color.trim())).size < 3
    ) {
      return res.status(400).json({
        success: false,
        message: "At least 3 distinct product colors are required",
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      originalPrice: originalPrice || null,
      tag: tag || "",
      rating: rating || 0,
      reviews: reviews || 0,
      colors: colors || [],
      variants: variants || [],
      image,
      description: description || "",
      specs: specs || [],
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("create product error:", err);
    res.status(500).json({ success: false, message: "Could not create product" });
  }
});

// DELETE /api/products/:id — public product deletion
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("delete product error:", err);
    res.status(500).json({ success: false, message: "Could not delete product" });
  }
});

module.exports = router;
