const express = require("express");
const router = new express.Router();
const Category = require("../../models/category");

router.get("/", async (req, res) => {
  try {
    let categories = await Category.find({});
    res.status(201).send({ status: true, categories });
  } catch (e) {
    console.log(`Error in GET route /api/category: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});
module.exports = router;
