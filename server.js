const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Router = require("./src/routes.js");
const dotenv = require("dotenv");
const morgan = require("morgan");

var { fomatConsol } = require("./src/middleware.js");
const rfs = require("rotating-file-stream");
const path = require("path");
const moment = require("moment");

dotenv.config();

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

var accessLogStream = rfs.createStream(
  `access - ${moment().format("ll")}.log`,
  {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "log"),
  }
);

app.use(morgan(fomatConsol, { stream: accessLogStream }))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", Router);
app.listen(parseInt(process.env.PORT), () => {
  console.log("Sever started");
});
