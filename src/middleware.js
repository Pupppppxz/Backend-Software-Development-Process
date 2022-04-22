const jwt = require("jsonwebtoken");
const multer = require("multer");
const rfs = require("rotating-file-stream");
const path = require("path");
const { randomString } = require("./services/auth.js");
const moment = require("moment");

const validateJWT = (req, res, next) => {
  try {
    if (req.headers.Authorization || req.headers.authorization) {
      let token = req.headers.authorization || req.headers.Authorization
      token = token.split(" ")[1]
      // eslint-disable-next-line no-undef
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verify;
      req.token = token;
    } else {
      return res.status(401).json({ message: "Cannot access!" });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Cannot access!" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/rooms");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + randomString(15) + path.extname(file.originalname));
  },
});

const storageForSingle = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/apartments")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + randomString(15) + path.extname(file.originalname))
  }
})

const storageForPdf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./owners")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + randomString(15) + path.extname(file.originalname))
  }
})

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

const pdfFilter = (req, file, cb) => {
  if (
    file.mimetype == "file/pdf"
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
}).array("uploadedImageArray", 20);

const singleImageUpload = multer({
  storage: storageForSingle,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
}).single("uploadedImageSingle")

const singlePdfUpload = multer({
  storage: storageForPdf,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: pdfFilter
}).single("uploadedPdf")

function formatConsole(tokens, req, res) {
  return [
    tokens.date(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ')
}

const accessControl = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,accept,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}

const accessLogStream = rfs.createStream(
  `access - ${moment().format("ll")}.log`,
  {
    interval: "1d", // rotate daily
    // eslint-disable-next-line no-undef
    path: path.join(__dirname, "log"),
  }
);

module.exports = {
  validateJWT,
  uploadArrayImage,
  accessLogStream,
  formatConsole,
  singleImageUpload,
  accessControl,
  singlePdfUpload
};
