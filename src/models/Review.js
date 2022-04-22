const mongoose = require("mongoose")

const ReviewSchema = mongoose.Schema({
    apartmentId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    nameUser: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
    }
)

const ReviewModel = mongoose.model('review', ReviewSchema)
module.exports = ReviewModel