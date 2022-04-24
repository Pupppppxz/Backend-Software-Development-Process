const { RoomModel, RoomImageModel } = require("../models/");
const mongoose = require("mongoose")
const fs = require("fs")

const checkIsExistRoom = async (_room, _apartment) => {
  try {
    const room = await RoomModel.findOne({ nameType: _room, apartmentId: _apartment });
    if (room) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
};

const checkIsExistImage = async (owner, apartment, type) => {
  try {
    const room = await RoomImageModel.findOne({
      owner: owner,
      apartment: apartment,
      roomType: type,
    });
    if (room) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
};

const validateRoom = async (aId, uId, role) => {
  const room = await RoomModel.findOne({ _id: aId });
  if (role !== "owner" || !room.ownerId.equals(mongoose.Types.ObjectId(uId))) {
    return false;
  }
  return room;
};

const findRoomByApartmentId = async (aId) => {
  try {
    const rooms = await RoomModel.find({ apartmentId: aId }).sort({ type: 'asc' })
    let obj = []
    for (let i = 0; i < rooms.length; i++) {
      obj.push({
        ...rooms[i]._doc,
        id: i
      })
    }
    return obj
  } catch (e) {
    console.log("Error while got room")
    return []
  }
}

const findNumberOfRoomInApartment = async (aId) => {
  try {
    const rooms = await RoomModel.find({ apartmentId: aId })
    const numberOfRoom = rooms.reduce((previousValue, currentValue) => previousValue + currentValue.room.length, 0)
    return numberOfRoom
  } catch (e) {
    return 0
  }
}

const deleteRoomImage = async (image) => {
  image.map(val => {
    console.log(val.src)
    fs.unlinkSync(`./uploads/${val.src}`, function (err) {
      if (err && err.code == "ENOENT") {
        console.log("file does not exist")
      } else if (err) {
        console.log("error to remove")
      } else {
        console.log("remove")
      }
    })
  })
}

const updateRoomDetail = async (roomId, newObj) => {
  try {
    await RoomModel.findByIdAndUpdate(roomId, {
      nameType: newObj.nameType,
      roomOptions: newObj.roomOptions,
      leaseAgreement: newObj.leaseAgreement,
      cashPledge: newObj.cashPledge,
      electricCost: newObj.electricCost,
      waterCost: newObj.waterCost,
      price: newObj.price,
      area: newObj.area
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const deleteRoomByApartmentId = async (apartmentId) => {
  try {
    const rooms = await RoomModel.find({ apartmentId: apartmentId })
    rooms.map(async (val) => {
      await RoomModel.findByIdAndDelete(val._id)
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = {
  checkIsExistRoom,
  validateRoom,
  checkIsExistImage,
  findRoomByApartmentId,
  findNumberOfRoomInApartment,
  deleteRoomImage,
  updateRoomDetail,
  deleteRoomByApartmentId
};
