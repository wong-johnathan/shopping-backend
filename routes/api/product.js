const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer");
const router = new express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Product");
const arraysEqual = require("../../utils/arraysEqual");
const upload = multer({ dest: "tmp/" });
const fs = require("fs");
const { uploadToBucket, deleteFromBucket } = require("../../config/storage");

router.post("/", [auth, upload.array("photos", 5)], async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    let images = [];
    for (const file of req.files) {
      const url = await uploadToBucket(file);
      images.push(url);
      fs.unlinkSync(file.path);
    }
    let product = new Product({ name, description, category, images, price, createdBy: req.user._id });
    await product.save();
    res.status(201).send({ status: true, product: { _id: product._id, name, description, category, price, images: product.images } });
  } catch (e) {
    console.log(`Error in POST route /product: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.get("/shop", async (req, res) => {
  try {
    // const searchParams = search ? { $text: { $search: search }, walletAddress } : { walletAddress };
    const { search, minPrice, maxPrice, order, sortBy, category, limit, page } = req.query;
    let query = {};
    if (search) query.name = { $regex: new RegExp(search), $options: "gi" };
    if (minPrice || maxPrice) query.price = { $gte: minPrice ? parseInt(minPrice) : undefined, $lte: maxPrice ? parseInt(maxPrice) : undefined };
    if (category) query.category = { $in: category.split(",").map((category) => category) };

    let sort = {};
    if (sortBy === "lastest") sort = { createdAt: -1 };
    else if (sortBy === "price" && order === "desc") sort = { price: -1 };
    else if (sortBy === "price" && order === "asc") sort = { price: 1 };
    let productCount = await Product.countDocuments();
    let products = await Product.find(query, "category name images price description createdBy")
      .sort(sort)
      .limit(limit ? parseInt(limit) : 3)
      .skip((page - 1) * limit);
    res.status(201).send({ status: true, products, count: productCount });
  } catch (e) {
    console.log(`Error in POST route /product: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let products = await Product.find({ createdBy: req.user._id }, "category name images price description");
    res.status(201).send({ status: true, products });
  } catch (e) {
    console.log(`Error in POST route /product: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.get("/id/:id", auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id, "category name images price description createdBy");
    if (!product) return res.send({ status: false, message: "Product does not exist." });
    res.status(201).send({ status: true, product });
  } catch (e) {
    console.log(`Error in GET route /product/id/${id}: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.delete("/id/:id", auth, async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.send({ status: false, message: "Product does not exist." });
    for (const image of product.images) await deleteFromBucket(image.name);
    res.status(201).send({ status: true, message: "Product successfully removed." });
  } catch (e) {
    console.log(`Error in DELETE route /product/id/${id}: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.patch("/id/:id", auth, upload.array("photos", 5), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.send({ status: false, message: "Product does not exist." });

    if (JSON.parse(req.body.deleted).length > 0)
      for (const deleted of JSON.parse(req.body.deleted)) {
        const file = product.images.find((image) => String(image._id) === deleted);
        await deleteFromBucket(file.name);
        product.images = product.images.filter((image) => String(image._id) !== deleted);
      }
    if (req.files.length > 0)
      for (const file of req.files) {
        const url = await uploadToBucket(file);
        product.images.push(url);
        fs.unlinkSync(file.path);
      }
    const allowedUpdates = ["name", "description", "category", "price"];
    console.log(req.body);
    for (const key of allowedUpdates) product[key] = req.body[key];
    await product.save();
    const { _id, name, description, category, price, images } = product;
    res.status(201).send({ status: true, product: { _id, name, description, category, price, images } });
  } catch (e) {
    console.log(`Error in DELETE route /product/id/${req.params.id}: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});
module.exports = router;
