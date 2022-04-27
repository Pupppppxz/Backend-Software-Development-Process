const { ApartmentModel } = require("../models/");
const fs = require("fs")
const mongoose = require("mongoose")

const checkIsExist = async (name) => {
  try {
    const apartment = await ApartmentModel.findOne({ name: name });
    if (apartment) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
};

const validateApartment = async (aId, uId, role) => {
  const apartment = await ApartmentModel.findOne({ _id: aId });
  if (
    role !== "owner" ||
    !apartment.ownerId.equals(mongoose.Types.ObjectId(uId))
  ) {
    return false;
  }
  return apartment;
};

const updateApartmentFee = async (aId, price) => {
  const apartment = await ApartmentModel.findOne({ _id: aId })
  if (apartment.rentalFeeMin > price || apartment.rentalFeeMin === 0) {
    await ApartmentModel.findByIdAndUpdate(aId, { rentalFeeMin: price })
  }
  if (apartment.rentalFeeMax < price || apartment.rentalFeeMax === 0) {
    await ApartmentModel.findByIdAndUpdate(aId, { rentalFeeMax: price })
  }
  return
}

const deleteApartmentImage = async (image) => {
  try {
    fs.unlinkSync(`./uploads/${image}`, function (err) {
      if (err && err.code == "ENOENT") {
        console.log("file does not exist")
      } else if (err) {
        console.log("error to remove")
      } else {
        console.log("remove")
      }
    })
    return
  } catch (e) {
    console.log(e)
    return
  }
}

const updateApartmentSave = async (val) => {
  try {
    await ApartmentModel.findByIdAndUpdate(val.id, {
      name: val.name,
      locationX: val.locationX,
      locationY: val.locationY,
      dormitoryType: val.dormitoryType,
      contact: val.contact,
      option: val.option,
      alley: val.alley
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = {
  checkIsExist,
  validateApartment,
  updateApartmentFee,
  deleteApartmentImage,
  updateApartmentSave
};
