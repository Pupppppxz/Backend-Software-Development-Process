const { ReviewModel } = require("../models")

const checkIsReviewExist = async (userId, apartmentId) => {
    const review = await ReviewModel.findOne({ userId: userId, apartmentId: apartmentId })
    if (review) {
        return true
    }
    return false
}

module.exports = {
    checkIsReviewExist
}