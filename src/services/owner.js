const { OwnerModel, UserModel } = require("../models")

const checkIsOwnerExist = async (userId) => {
    try {
        const owner = await OwnerModel.findOne({ userId })
        if (owner) {
            return owner
        }
        return false
    } catch (e) {
        console.log(e)
        return false
    }
}

const updateToOwner = async (userId, bool) => {
    try {
        if (bool) {
            await UserModel.findByIdAndUpdate(userId, { role: "owner" })
        } else {
            await UserModel.findByIdAndUpdate(userId, { role: "customer" })
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

module.exports = {
    checkIsOwnerExist,
    updateToOwner
}