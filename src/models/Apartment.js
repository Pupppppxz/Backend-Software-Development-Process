const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    locationX: {
      type: String,
      required: true,
      trim: true,
    },
    locationY: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfRoom: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    },
    rentalFeeMin: {
      type: Number,
      default: 0
    },
    rentalFeeMax: {
      type: Number,
      default: 0
    },
    dormitoryType: {
      type: String,
      enum: ["male", "female", "both"],
      required: true
    },
    contact: {
      type: String,
      required: true,
      maxlength: 10
    },
    imgAptSrc: {
      type: String,
      required: true
    },
    option: {
      internet: Boolean,
      cctv: Boolean,
      keyCard: Boolean,
      laundry: Boolean,
      carPark: Boolean,
      coinWashingMachine: Boolean
    },
    alley: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApartmentModel = mongoose.model("apartment", ApartmentSchema);
module.exports = ApartmentModel;
