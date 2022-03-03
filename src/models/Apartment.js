const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema(
  {
    owner: {
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
      required: true,
    },
    notAvailable: {
      type: Number,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    airRoom: {
      type: Number,
      required: true,
    },
    fanRoom: {
      type: Number,
      required: true,
    },
    soi: {
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
