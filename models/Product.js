const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        index:{type:Number},
        id: { type: String },
        url: { type: String },
        name: { type: String },
        originalname: { type: String },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("product", productSchema);

module.exports = Product;
