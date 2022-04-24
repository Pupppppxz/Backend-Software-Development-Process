const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Router = require("./src/routes.js");
const dotenv = require("dotenv");
const morgan = require("morgan");

var { formatConsole, accessControl, accessLogStream } = require("./src/middleware.js");

dotenv.config();

mongoose
  // eslint-disable-next-line no-undef
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

app.use(morgan(formatConsole, { stream: accessLogStream }))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('uploads/'));
app.use(express.static('owners/'));
app.use(accessControl);
// eslint-disable-next-line no-undef
// app.use('/apartments', express.static(__dirname + '/apartments/'));
app.use("/api", Router);
// eslint-disable-next-line no-undef
app.listen(parseInt(process.env.PORT), () => {
  console.log("Sever started");
});
