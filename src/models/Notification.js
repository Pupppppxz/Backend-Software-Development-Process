const mongoose = require("mongoose")

const NotificationSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    apartmentId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    nameCustomer: {
        type: String,
        required: true
    },
    nameOwner: {
        type: String,
        required: true
    },
    contactOwner: {
        type: String,
        required: true
    },
    contactCustomer: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    rentalFee: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    leaseAgreement: {
        type: Number,
        required: true
    },
    cashPledge: {
        type: Number,
        required: true
    },
    locationX: {
        type: String,
        required: true
    },
    locationY: {
        type: String,
        required: true
    },
    statusAccept: {
        type: Boolean,
        default: false
    },
    statusReject: {
        type: Boolean,
        default: false
    },
    statusCancel: {
        type: Boolean,
        default: false
    },
    chat: [{
        message: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            default: new Date()
        },
        dateTrans: {
            type: String,
            required: true
        },
        timeTrans: {
            type: String,
            required: true
        },
        from: {
            type: String,
            enum: ['customer', 'owner'],
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
})

const NotificationModel = mongoose.model('notification', NotificationSchema)
module.exports = NotificationModel