const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

categorySchema.virtual("product", {
  ref: "product",
  localField: "_id",
  foreignField: "category",
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
