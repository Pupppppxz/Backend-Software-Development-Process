const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/");
const bcrypt = require("bcrypt")
const sha256 = require("sha256")

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

const validatePhoneNumber = (phone) => {
  return phone.length === 10 && phone[0] === "0"
}

const validateEmail = (email) => {
  return String(email).toLowerCase().trim().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

const validatePassword = (password) => {
  let pass = 0
  if (String(password).match(/[a-z]/g)) {
    pass += 1
  }
  if (String(password).match(/[A-Z]/g)) {
    pass += 1
  }
  if (String(password).match(/[0-9]/g)) {
    pass += 1
  }
  if (String(password).length >= 3) {
    pass += 1
  }
  return pass === 4
}

const validateName = (str) => {
  if ((str.match(/[a-z]/g) || str.match(/[A-Z]/g)) && !str.match(/[0-9]/g)) {
    return String(str).map(w => w.toUpperCase() + w.slice(1).toLowerCase())
  }
  return str
}

const checkIsTokenExpired = (token) => {
  try {
    const { exp } = jwt.decode(token)
    if (exp < (new Date().getTime() + 1) / 1000) {
      return true
    }
    return false
  } catch (err) {
    console.log("hello 2")
    return true
  }
}

const updateUserToken = async (id, token) => {
  const update = await UserModel.findByIdAndUpdate(id, { token: token })
  return update
}

const createPayload = async (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    fullname: user.firstName + " " + user.lastName,
    role: user.role,
    phone: user.phone
  }
  return payload
}

const createLoginReturnObj = async (user, token) => {
  const payload = {
    id: user._id,
    token: "Bearer " + token,
    email: user.email,
    fullname: user.firstName + " " + user.lastName,
    role: user.role,
  }
  return payload
}

const generateToken = async (payload) => {
  // eslint-disable-next-line no-undef
  const secretKey = process.env.SECRET_KEY;
  return jwt.sign(
    payload,
    secretKey,
    {
      expiresIn: 60 * 60 * 24 * 30
    }
  );
}

const comparePassword = (password, userPassword) => {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(sha256(password), userPassword, function(err, res) {
      if (err) {
        reject(err)
      }
      if (res) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
  })
}

module.exports = {
  checkIsExist,
  randomString,
  validatePhoneNumber,
  validateEmail,
  validatePassword,
  validateName,
  checkIsTokenExpired,
  updateUserToken,
  createPayload,
  generateToken,
  createLoginReturnObj,
  comparePassword
};
