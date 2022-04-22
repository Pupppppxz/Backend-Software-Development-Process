const mongoose = require("mongoose")

const OwnerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    approve: {
        type: Boolean,
        default: false
    },
    idCard: {
        type: String,
        default: ""
    },
    apartmentRule: {
        type: String,
        default: ""
    },
    applicationForPrivate: {
        type: String,
        default: ""
    },
    applicationForLicense: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
})

const OwnerModel = mongoose.model('owner', OwnerSchema)
module.exports = OwnerModel