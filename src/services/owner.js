const { OwnerModel, UserModel } = require("../models")
const fs = require("fs")

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
            await UserModel.findByIdAndUpdate(userId, { role: "owner", token: "" })
        } else {
            await UserModel.findByIdAndUpdate(userId, { role: "customer" })
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

const deletePdf = async (file) => {
    try {
        fs.unlinkSync(`./owners/${file}`, function (err) {
            if (err && err.code == "ENOENT") {
                console.log("file does not exist")
            } else if (err) {
                console.log("error to remove")
            } else {
                console.log("remove")
            }
        })
        return
    } catch (e) {
        console.log(e)
        return
    }
}

const deletePdfArray = async (pdf) => {
    try {
        pdf.map(val => {
            if (val !== "") {
                fs.unlinkSync(`./owners/${val.src}`, function (err) {
                    if (err && err.code == "ENOENT") {
                        console.log("file does not exist")
                    } else if (err) {
                        console.log("error to remove")
                    } else {
                        console.log("remove")
                    }
                })
            }
        })
        return
    } catch (e) {
        console.log(e)
        return
    }
}

module.exports = {
    checkIsOwnerExist,
    updateToOwner,
    deletePdf,
    deletePdfArray
}