const { RoomModel, RoomImageModel } = require("../models/");

const checkIsExistRoom = async (_room) => {
  try {
    const room = await RoomModel.findOne({ room: _room });
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
  const room = await RoomModel.findOne({ id: aId });
  if (role !== "owner" || room.owner !== mongoose.Types.ObjectId(uId)) {
    return false;
  }
  return true;
};

module.exports = {
  checkIsExistRoom,
  validateRoom,
  checkIsExistImage
};
