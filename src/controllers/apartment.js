const mongoose = require("mongoose");
const { ApartmentModel } = require("../models/");
const { checkIsExist, validateApartment } = require("../services/apartment.js");

const createController = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Cannot create apartment" });
    }
    const isExist = await checkIsExist(req.body.name);
    if (isExist) {
      return res.status(400).json({ message: "apartment already exist" });
    }
    req.body.owner = req.user.id;
    const newApartment = new ApartmentModel({ ...req.body });
    newApartment
      .save()
      .then(() => res.status(201).json({ message: "Created!" }))
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Cannot create apartment" });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Cannot create apartment" });
  }
};

const updateController = async (req, res) => {
  try {
    const validate = await validateApartment(
      req.body.id,
      req.user.id,
      req.user.role
    );
    if (!validate) {
      return res.status(400).json({ message: "Cannot update apartment" });
    }
    const { id, ...newObj } = req.body;
    const updated = await ApartmentModel.findByIdAndUpdate(id, { ...newObj });
    return res.status(204).json({ message: "Updated!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Cannot update apartment" });
  }
};

const getByNameController = async (req, res) => {
  try {
    const apartment = await ApartmentModel.findOne({ name: req.params.name });
    const { _id, ...newObj } = apartment;
    return res.status(200).send(newObj);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot get apartment" });
  }
};

const getAllController = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Cannot get apartment" });
    }
    const apartments = await ApartmentModel.find({ owner: req.user.id });
    return res.status(200).send(apartments);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot get apartment" });
  }
};

const deleteController = async (req, res) => {
  try {
    const validate = await validateApartment(
      req.body.id,
      req.user.id,
      req.user.role
    );
    if (!validate) {
      return res.status(400).json({ message: "Cannot update apartment" });
    }
    const deleted = await ApartmentModel.findByIdAndDelete(req.body.id);
    return res.status(204).json({ message: "Updated!" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot delete apartment" });
  }
};

module.exports = {
  createController,
  updateController,
  deleteController,
  getByNameController,
  getAllController,
};
