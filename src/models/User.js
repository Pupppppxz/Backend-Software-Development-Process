const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      minlength: 0,
    },
    role: {
      type: String,
      enum: ["admin", "owner", "customer"],
      default: "customer"
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      default: "",
      maxlength: 10,
    },
    forgotPassword: {
      type: String,
      default: ""
    },
    token: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
