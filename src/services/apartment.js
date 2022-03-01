const { ApartmentModel } = require("../models/");

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
  const apartment = await ApartmentModel.findOne({ id: aId });
  if (
    role !== "owner" ||
    apartment.owner !== mongoose.Types.ObjectId(uId)
  ) {
    return false;
  }
  return true;
};

module.exports = {
  checkIsExist,
  validateApartment
};
