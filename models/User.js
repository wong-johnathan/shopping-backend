const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.jwtSecret;
const AccessLevel = require("./AccessLevel");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    contact: {
      type: String,
      trim: true,
    },
    updatePassword: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    }
  },
  { timestamps: true }
);

categorySchema.virtual("categories", {
  ref: "category",
  localField: "_id",
  foreignField: "createdBy",
});

categorySchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.methods.getPublicProfile = async function () {
  const { password, tokens, updatePassword, updatedAt, createdAt, ...userObject } = this.toObject();
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, jwtSecret, { expiresIn: "14d" });
  return token;
};

userSchema.methods.generateAPIKey = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, jwtSecret, { expiresIn: "14d" });
  return token;
};

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = jwt.sign({ _id: this._id.toString() }, jwtSecret, { expiresIn: "7d" });
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000 * 6;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login: User does not exist");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login: Invalid password");
  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
