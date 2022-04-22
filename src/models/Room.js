const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    apartmentId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    room: [{
      roomNumber: {
        type: String,
        required: true,
      },
      available: {
        type: Boolean,
        default: true
      }
    }],
    nameType: {
      type: String,
      required: true,
    },
    roomOption: {
      air: Boolean,
      refrigerator: Boolean,
      fan: Boolean,
      television: Boolean,
      waterHeater: Boolean,
      washingMachine: Boolean,
      cookingStove: Boolean,
    },
    contract: {
      leaseAgreement: {
        type: Number,
        default: 1
      },
      cashPledge: {
        type: Number,
        default: 10000
      }
    },
    numOfRoomTotal: {
      type: Number,
      default: 0
    },
    electricCost: {
      type: Number,
      default: 8
    },
    waterCost: {
      type: Number,
      default: 18
    },
    rating: {
      type: Number,
      default: null
    },
    price: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    img: [{
      id: Number,
      src: String
    }],
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model("room", RoomSchema);
module.exports = RoomModel;
