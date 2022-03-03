const jwt = require("jsonwebtoken");
const multer = require("multer");
const rfs = require("rotating-file-stream");
const path = require("path");
const { randomString } = require("./services/auth.js");
const moment = require("moment");
const chalk = require ('../node_modules/boxen/node_modules/chalk');


const validateJWT = (req, res, next) => {
  try {
    if (req.headers.Authorization) {
      const token = req.headers.Authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
      req.token = token;
    } else {
      return res.status(400).json({ message: "Cannot access!" });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot access!" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + randomString(10));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadArrayImage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
}).array("uploadedImage", 20);

var accessLogStream = rfs.createStream(
  `access - ${moment().format("ll")}.log`,
  {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "log"),
  }
);

function fomatConsol (tokens, req, res) {
  return [
    tokens.date(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ')
}

module.exports = {
  validateJWT,
  uploadArrayImage,
  accessLogStream,
  fomatConsol
};
