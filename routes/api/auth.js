const express = require("express");
const router = new express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
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

router.post("/logout", auth, async (req, res) => {
  try {
    // req.user.tokens = [];
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.headers("Authorization"));
    await req.user.save();
    res.send("logout");
  } catch (e) {
    console.log(`Error in POST route /admin/logout: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("logout");
  } catch (e) {
    console.log(`Error in POST route /user/logoutall: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findByCredentials({ email, password });
    const token = await User.generateAuthToken();
    user.save();
    res.send({ user: await user.getPublicProfile(), token });
  } catch (e) {
    console.log(`Error in POST route /user/login: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.get("/me", auth, async (req, res) => {
  res.send(await req.user.getPublicProfile());
});

router.patch("/password", auth, async (req, res) => {
  try {
    const oldPassword = req.body.password;
    const newPassword = req.body.password1;
    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (isMatch) {
      req.user.password = newPassword;
      await req.user.save();
      res.send("Password has been changed");
    } else res.status(200).send(false);
  } catch (e) {
    console.log(`Error in PATCH route /user/password: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

module.exports = router;
