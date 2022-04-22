const { ApartmentModel } = require("../models");
const { checkIsExist, validateApartment, deleteApartmentImage, updateApartmentSave } = require("../services/apartment.js");
const { findRoomByApartmentId } = require("../services/room")

const createController = async (req, res) => {
  try {
    const { role, id, phone } = req.user
    const { internet, cctv, keyCard, laundry, carPark, coinWashingMachine, ...newObj } = req.body
    if (role !== "owner") {
      return res.status(401).json({ message: "Cannot create apartment" });
    }
    console.log("file = ", req.file)
    console.log("body = ", req.body)
    const isExist = await checkIsExist(newObj.name);
    if (isExist) {
      return res.status(400).json({ message: "apartment already exist" });
    }
    newObj.ownerId = id;
    newObj.option = {
      internet, cctv, keyCard, laundry, carPark, coinWashingMachine
    }
    newObj.contact = phone
    newObj.imgAptSrc = "apartments/" + req.file.filename
    const newApartment = new ApartmentModel({ ...newObj });
    newApartment
      .save()
      .then(() => res.status(201).json({ message: "Created!" }))
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Cannot create apartment" });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
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
      return res.status(401).json({ message: "Cannot access" });
    }
    const update = await updateApartmentSave(req.body)
    if (!update) {
      return res.status(400).json({ message: "Error while update!" });
    }
    return res.status(204).json({ message: "Updated!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateImageController = async (req, res) => {
  try {
    const validate = await validateApartment(
      req.body.id,
      req.user.id,
      req.user.role
    );
    if (!validate) {
      return res.status(401).json({ message: "Cannot access" });
    }
    await deleteApartmentImage(validate.imgAptSrc)
    await ApartmentModel.findByIdAndUpdate(req.body.id, { imgAptSrc: "apartments/" + req.file.filename });
    return res.status(204).json({ message: "Updated!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
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
      return res.status(400).json({ message: "Cannot delete apartment" });
    }
    await deleteApartmentImage(validate.imgAptSrc)
    await ApartmentModel.findByIdAndDelete(req.body.id);
    return res.status(200).json({ message: "Delete!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getOwnerApartment = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Cannot get apartment" });
    }
    const apartments = await ApartmentModel.find({ ownerId: req.user.id });
    return res.status(200).send(apartments);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getOwnerApartmentAndRoom = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Cannot get apartment" });
    }
    const apartments = await ApartmentModel.find({ ownerId: req.user.id });
    let apartmentsWithRoom = []
    for (let index = 0; index < apartments.length; index++) {
      const rooms = await findRoomByApartmentId(apartments[index]._doc._id)
      const obj = {
        ...apartments[index]._doc,
        rooms
      }
      apartmentsWithRoom.push(obj)
    }
    return res.status(200).send(apartmentsWithRoom);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getByNameController = async (req, res) => {
  try {
    const apartment = await ApartmentModel.findOne({ name: req.params.name });
    const { ...newObj } = apartment._doc;
    const rooms = await findRoomByApartmentId(newObj._id)
    newObj.rooms = rooms
    return res.status(200).send(newObj);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getByIdController = async (req, res) => {
  try {
    const apartment = await ApartmentModel.findOne({ _id: req.params.id });
    const { ...newObj } = apartment._doc;
    const rooms = await findRoomByApartmentId(newObj._id)
    newObj.rooms = rooms
    return res.status(200).send(newObj);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllController = async (req, res) => {
  try {
    const allApartments = await ApartmentModel.find({})
    let allApartmentsWithRoom = []
    for (let index = 0; index < allApartments.length; index++) {
      const rooms = await findRoomByApartmentId(allApartments[index]._doc._id)
      const obj = {
        ...allApartments[index]._doc,
        rooms
      }
      allApartmentsWithRoom.push(obj)
    }
    return res.status(200).send(allApartmentsWithRoom)
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createController,
  updateController,
  deleteController,
  getByNameController,
  getOwnerApartment,
  getByIdController,
  getOwnerApartmentAndRoom,
  getAllController,
  updateImageController
};
