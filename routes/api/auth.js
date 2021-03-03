const express = require("express");
const router = new express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const User = require("../../models/User");
const { setUpAccount, resetPassword } = require("../../utils/email");

router.post("/register", async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    if (await User.findOne({ email })) return res.status(201).send({ status: false, message: "Cannot create new account with this email address." });

    const password = generator.generate({
      length: 10,
      numbers: true,
    });

    let user = new User({ name, email, password, contact });
    await user.save();
    user.generatePasswordReset();
    await user.save();
    res.status(201).send({ status: true, message: "Please check your email to verify your account" });
    setUpAccount({ to: email, name, token: user.resetPasswordToken });
  } catch (e) {
    console.log(`Error in POST route /auth/register: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    let user = await User.findByCredentials({ email, password });
    const token = await user.generateAuthToken();
    res.send({ user: await user.getPublicProfile(), token });
  } catch (e) {
    console.log(`Error in POST route /auth/login: ${e.message}`);
    res.status(400).send({ status: false, message: e.message });
  }
});

router.get("/me", auth, async (req, res) => {
  res.send({ status: true, authUser: await req.user.getPublicProfile() });
});

router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(200).send({ status: false, message: "Password token is invalid or has expired" });
    if (req.body.password.length < 7) return res.status(200).send({ status: false, message: "Password length must be greater than 7." });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.send({ status: true, message: "Your password has been updated" });
    resetPassword({ name: user.name, to: user.email });
  } catch (e) {
    console.log(`Error in POST route /api/auth/reset-password: ${e.message}`);
    res.status(400).send(e);
  }
});

module.exports = router;
