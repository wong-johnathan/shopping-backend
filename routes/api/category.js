const express = require("express");
const router = new express.Router();
const auth = require("../../middleware/auth");
const generator = require("generate-password");
const User = require("../../models/User");

router.post("/register", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (await User.findOne({ email })) return res.status(201).send("Cannot create new account with this email address.");

    const password = generator.generate({
      length: 10,
      numbers: true,
    });

    let user = new User({ name, email, password, createdBy: req.user._id });
    await user.save();
    res.status(201).send({ user: await user.getPublicProfile(), password });
  } catch (e) {
    console.log(`Error in POST route /user/register: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

module.exports = router;
