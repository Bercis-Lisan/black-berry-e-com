const mongoose = require("mongoose");

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "mobiles", "computers"
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    tag: { type: String, default: "" }, // e.g. "New", "Sale"
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    colors: { type: [String], default: [] },
    variants: { type: [String], default: [] },
    image: { type: String, required: true }, // image URL
    description: { type: String, default: "" },
    specs: { type: [specSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
