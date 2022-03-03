const { UserModel } = require("../models/");
const { checkIsExist, randomString } = require("../services/auth.js");
const bcrypt = require("bcrypt");
const sha256 = require("sha256");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { firstName, lastName, password, email, sex, phone } = req.body;
    const { password2, ...newObj } = req.body;
    const isExist = await checkIsExist(email);
    if (isExist) {
      return res.status(400).json({ message: "Email already exist!" });
    }
    if (!firstName || !lastName || !password || !email || !sex) {
      return res.status(400).json({ message: "Please complete all field" });
    }
    if (password != password2) {
      return res.status(400).json({ message: "Password must match" });
    }
    const newUser = new UserModel({ ...newObj });
    const salt = parseInt(process.env.SALT, 10);
    newUser.password = await bcrypt.hash(sha256(password), salt);
    newUser
      .save()
      .then(() => res.status(201).json({ message: "Registered" }))
      .catch((err) => res.status(400).json({ message: "Cannot register" }));
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Cannot register" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({ message: "Please complete all field" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or Password incorrect" });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (isMatch) {
      const secretKey = process.env.c;
      const payload = {
        id: user.id,
        email: user.email,
        fullname: user.firstName + " " + user.lastName,
        role: user.role,
      };
      jwt.sign(
        payload,
        secretKey,
        {
          expiresIn: 60 * 60 * 24 * 30,
        },
        (err, token) => {
          if (err) {
            return res.status(400).json({ message: "Cannot login" });
          }
          res.json({
            success: true,
            token: "Bearer " + token,
            id: user._id,
            fullname: user.firstName + " " + user.lastName,
            role: user.role,
          });
        }
      );
    } else {
      return res
        .status(400)
        .json({ message: "Username or Password incorrect" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Cannot login" });
  }
};

const forgotPassword = async (req, res) => {
  const {} = req.body;
};

module.exports = {
  register,
  login,
};
