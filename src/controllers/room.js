const mongoose = require("mongoose");
const { RoomModel, RoomImageModel } = require("../models/");
const {
  checkIsExistRoom,
  validateRoom,
  checkIsExistImage,
} = require("../services/room.js");

const createOneController = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Cannot create room" });
    }
    const isExist = await checkIsExistRoom(req.body.room);
    if (isExist) {
      return res.status(400).json({ message: "Room already exists!" });
    }
    const image = await checkIsExistImage(
      req.user.id,
      req.body.apartment,
      req.body.class
    );
    if (!image) {
      return res.status(400).json({ message: "Cannot find image for room" });
    }
    req.body.owner = req.user.id;
    const newRoom = new RoomModel({ ...req.body });
    newRoom
      .save()
      .then(() => res.status(201).json({ message: "created!" }))
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Cannot created!" });
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot create!" });
  }
};

const createMultipleController = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Cannot create room" });
    }
    const isExist = await checkIsExistRoom(req.body.room);
    if (isExist) {
      return res.status(400).json({ message: "Room already exists!" });
    }
    const image = await checkIsExistImage(
      req.user.id,
      req.body.apartment,
      req.body.class
    );
    if (!image) {
      return res.status(400).json({ message: "Cannot find image for room" });
    }
    const allObject = req.body.obj.map((obj) => (obj.owner = req.user.id));
    RoomModel.insertMany(allObject)
      .then(() => res.status(201).json({ message: "created!" }))
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Cannot created!" });
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot create!" });
  }
};

const updateOneController = async (req, res) => {
  try {
    const { roomId, apartmentId, ...newObj } = req.body;
    const validated = await validateRoom(roomId, req.user.id, apartmentId);
    if (!validated) {
      return res.status(400).json({ message: "Cannot modify" });
    }
    const updated = await RoomModel.findByIdAndUpdate(roomId, { ...newObj });
    return res.status(200).json({ message: "Updated" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot update" });
  }
};

const updateMultipleController = async (req, res) => {
  try {
    const { roomId, apartmentId, ...newObj } = req.body;
    const validated = await validateRoom(roomId, req.user.id, apartmentId);
    if (!validated) {
      return res.status(400).json({ message: "Cannot modify" });
    }

  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Cannot update" });
  }
};

module.exports = {
  createOneController,
  createMultipleController,
  updateOneController,
  updateMultipleController
};
