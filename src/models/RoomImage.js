const mongoose = require("mongoose");

const RoomImageSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    apartment: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    image: [
      {
        url: String,
      },
    ],
    roomType: {
      type: String,
      enum: ["air", "fan", "studio"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomImageModel = mongoose.model("roomImage", RoomImageSchema);
module.exports = RoomImageModel;
