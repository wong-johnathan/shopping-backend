const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

categorySchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "category",
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
