const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    apartment: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
      default: 0,
    },
    class: {
      type: String,
      enum: ["air", "fan", "studio"],
      required: true,
    },
    optionBuildIn: {
      type: Array,
      default: [],
    },
    optionInRoom: {
      type: Array,
      default: [],
    },
    price: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    roomImage: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model("room", RoomSchema);
module.exports = RoomModel;
