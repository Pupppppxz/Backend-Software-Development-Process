const express = require("express");

const Router = express.Router();
const AuthController = require("./controllers/auth.js");
const ApartmentController = require("./controllers/apartment.js");

Router.get("/", (req, res) =>
  res
    .send("Hello guys, this is software development process project !")
    .status(200)
);

// authentication
Router.post("/login", (req, res) => AuthController.login(req, res));
Router.post("/register", (req, res) => AuthController.register(req, res));

// apartment
Router.post("/apmnt", (req, res) =>
  ApartmentController.createController(req, res)
);
Router.get("/apmnt-name", (req, res) =>
  ApartmentController.getByNameController(req, res)
);
Router.get("/apmnt-all", (req, res) =>
  ApartmentController.getAllController(req, res)
);
Router.put("/apmnt", (req, res) =>
  ApartmentController.updateController(req, res)
);
Router.delete("/apmnt", (req, res) =>
  ApartmentController.deleteController(req, res)
);

module.exports = Router;
