const { UserModel } = require("../models/");
const { checkIsExist, validatePassword, validateEmail, validatePhoneNumber, checkIsTokenExpired, updateUserToken, createPayload, generateToken, createLoginReturnObj, comparePassword } = require("../services/auth.js");
const bcrypt = require("bcrypt");
const sha256 = require("sha256");

const register = async (req, res) => {
  try {
    const { firstName, lastName, password, email, gender, phone } = req.body;
    const { password2, ...newObj } = req.body;
    const isExist = await checkIsExist(email);
    if (isExist) {
      return res.status(400).json({ message: "Email already exist!" });
    }
    if (!firstName || !lastName || !password || !email || !gender || !phone) {
      return res.status(400).json({ message: "Please complete all field" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email Error" });
    }
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ message: "Phone number Error" });
    }
    if (gender !== "male" && gender !== "female") {
      return res.status(400).json({ message: "Something went wrong, Please not try again!" })
    }
    if (password !== password2 && validatePassword(password)) {
      return res.status(400).json({ message: "Password Error" });
    }
    const newUser = new UserModel({ ...newObj });
    // eslint-disable-next-line no-undef
    const salt = parseInt(process.env.SALT, 10);
    newUser.password = await bcrypt.hash(sha256(password), salt);
    const payload = await createPayload(newUser)
    newUser.token = await generateToken(payload)
    newUser
      .save()
      .then(() => res.status(201).json({ message: "Registered" }))
      .catch((err) => {
        console.log(err)
        res.status(400).json({ message: "Cannot register" })
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Cannot register" });
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
    const isMatch = await comparePassword(password, user.password);
    if (isMatch) {
      if (checkIsTokenExpired(user.token)) {
        const payload = await createPayload(user)
        const token = await generateToken(payload)
        await updateUserToken(user._id, token)
        const returnObj = await createLoginReturnObj(user, token)
        return res.status(200).json(returnObj);
      }
      const returnObj = await createLoginReturnObj(user, user.token)
      return res.status(200).json(returnObj)
    }
    return res
      .status(400)
      .json({ message: "Username or Password incorrect" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Cannot login" });
  }
};

// const forgotPassword = async (req, res) => {
//   const { } = req.body;
// };

module.exports = {
  register,
  login,
};
