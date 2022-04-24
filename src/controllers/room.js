const { RoomModel, ApartmentModel } = require("../models/");
const { updateApartmentFee } = require("../services/apartment");
const {
  checkIsExistRoom,
  validateRoom,
  findNumberOfRoomInApartment,
  deleteRoomImage,
  updateRoomDetail,
} = require("../services/room.js");

const createRoomTypeController = async (req, res) => {
  try {
    const { air, refrigerator, fan, television, waterHeater, washingMachine, cookingStove, leaseAgreement, cashPledge, ...newObj } = req.body
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Cannot create room" });
    }
    const isExist = await checkIsExistRoom(newObj.nameType);
    if (isExist) {
      return res.status(400).json({ message: "Room already exists!" });
    }
    const roomOption = {
      air,
      refrigerator,
      fan,
      television,
      waterHeater,
      washingMachine,
      cookingStove
    }
    const contract = {
      leaseAgreement,
      cashPledge
    }
    req.body.ownerId = req.user.id
    req.body.roomOption = roomOption
    req.body.contract = contract
    if (req.files.length === 0) {
      return res.status(400).json({ message: "Please upload image" })
    }
    let roomImage = req.files.map((val, index) => ({
      id: index,
      src: "rooms/" + val.filename
    }))
    req.body.img = roomImage
    const newRoom = new RoomModel({ ...req.body });
    await updateApartmentFee(req.body.apartmentId, req.body.price)
    newRoom
      .save()
      .then(() => {
        res.status(201).json({ message: "created!" })
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Cannot created!" });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot create!" });
  }
};

const deleteRoomTypeController = async (req, res) => {
  try {
    const { roomId } = req.body;
    const validated = await validateRoom(roomId, req.user.id, req.user.role);
    if (!validated) {
      return res.status(403).json({ message: "Cannot modify" });
    }
    await deleteRoomImage(validated.img)
    await RoomModel.findByIdAndDelete(roomId);
    return res.status(200).json({ message: "delete!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot delete" });
  }
};

const updateRoomTypeController = async (req, res) => {
  try {
    const { roomId, ...newObj } = req.body;
    const validated = await validateRoom(roomId, req.user.id, req.user.role);
    if (!validated) {
      return res.status(401).json({ message: "Cannot modify" });
    }
    const update = await updateRoomDetail(roomId, newObj)
    if (!update) {
      return res.status(400).json({ message: "Error while update" });
    }
    return res.status(200).json({ message: "Updated" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot update" });
  }
};

const updateRoomImageController = async (req, res) => {
  try {
    const { roomId, oldImageUrl } = req.body;
    const validated = await validateRoom(roomId, req.user.id, req.user.role);
    if (!validated) {
      return res.status(403).json({ message: "Cannot modify" });
    }
    let oldImageSplit = oldImageUrl.split("$$")
    const imageForDelete = validated.img.filter(item => !oldImageSplit.includes(item.src))
    let newRoomImage = oldImageSplit.map((val, index) => ({
      id: index,
      src: val
    }))
    let length = newRoomImage.length
    if (req.files.length !== 0) {
      req.files.map((val, index) => {
        newRoomImage.push({
          id: index + length,
          src: "rooms/" + val.filename
        })
      })
    }
    await deleteRoomImage(imageForDelete)
    await RoomModel.findByIdAndUpdate(roomId, { img: newRoomImage });
    return res.status(200).json({ message: "Updated" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot update" });
  }
};

const updateAvailableRoomController = async (req, res) => {
  try {
    const { roomId, roomNumber, available } = req.body;
    const validated = await validateRoom(roomId, req.user.id, req.user.role);
    if (!validated) {
      return res.status(403).json({ message: "Cannot modify" });
    }
    let index = validated.room.map(val => val.roomNumber).indexOf(roomNumber)
    validated.room[index].available = available
    await RoomModel.findByIdAndUpdate(roomId, { room: validated.room });
    return res.status(200).json({ message: "Updated" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot update" });
  }
}

const insertRoomController = async (req, res) => {
  try {
    const { roomId, apartmentId, roomDetail } = req.body;
    const validated = await validateRoom(roomId, req.user.id, req.user.role);
    if (!validated) {
      return res.status(403).json({ message: "Cannot modify" });
    }
    let roomDetailSplit = roomDetail.split("$$")
    let count = 0
    roomDetailSplit.map(val => {
      let valSplit = val.split(",")
      if (validated.room.map(obj => obj.roomNumber).indexOf(valSplit[0]) === -1) {
        count++
        validated.room.push({
          roomNumber: valSplit[0],
          available: valSplit[1] === "true" ? true : false
        })
      }
    })
    await RoomModel.findByIdAndUpdate(roomId, { room: validated.room, numOfRoomTotal: validated.numOfRoomTotal + count });
    const numberOfRoom = await findNumberOfRoomInApartment(apartmentId)
    await ApartmentModel.findByIdAndUpdate(validated.apartmentId, { numberOfRoom: numberOfRoom })
    return res.status(200).json({ message: "insert!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot insert" });
  }
}

const deleteRoomController = async (req, res) => {
  try {
    const { roomId, apartmentId, roomNumber } = req.body;
    const validated = await validateRoom(roomId, req.user.id, req.user.role);
    if (!validated) {
      return res.status(403).json({ message: "Cannot modify" });
    }
    const totalRoom = validated.room.filter(val => val.roomNumber !== roomNumber)
    await RoomModel.findByIdAndUpdate(roomId, { room: totalRoom, numOfRoomTotal: validated.numOfRoomTotal - 1 });
    const numberOfRoom = await findNumberOfRoomInApartment(apartmentId)
    await ApartmentModel.findByIdAndUpdate(apartmentId, { numberOfRoom: numberOfRoom })
    return res.status(200).json({ message: "delete!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot update" });
  }
}

module.exports = {
  createRoomTypeController,
  updateRoomTypeController,
  deleteRoomTypeController,
  updateRoomImageController,
  insertRoomController,
  deleteRoomController,
  updateAvailableRoomController
};
