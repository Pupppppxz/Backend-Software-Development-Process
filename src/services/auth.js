const { UserModel } = require("../models/");

const checkIsExist = async (email) => {
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
};

const randomString = (length) => {
  let result = "";
  let c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < length; i++) {
    result += c[Math.floor(Math.random() * c.length)];
  }
  return result;
};

module.exports = {
  checkIsExist,
  randomString,
};
