const { OwnerModel } = require("../models")
const { checkIsOwnerExist, updateToOwner } = require("../services/owner")

const requestToBeOwner = async (req, res) => {
    try {
        const { role, id: userId } = req.user
        if (role !== "customer") {
            return res.status(403).json({ message: "Not permission" })
        }
        const owner = await checkIsOwnerExist(userId)
        if (owner) {
            return res.status(400).json({ message: "Already exist" })
        }
        const newOwner = new OwnerModel({
            userId
        })
        newOwner
            .save()
            .then(() => res.status(201).json({ message: "Complete to request" }))
            .catch(e => {
                console.log(e)
                return res.status(400).json({ message: "Error while request" })
            })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const ownerUploadPdf = async (req, res) => {
    try {
        const { role, id: userId } = req.user
        const { type } = req.body
        if (role !== "customer") {
            return res.status(403).json({ message: "Not permission" })
        }
        const owner = await checkIsOwnerExist(userId)
        if (!owner) {
            return res.status(400).json({ message: "Invalid request" })
        }
        const pdfFile = req.file.filename
        if (pdfFile) {
            if (type === "idCard") {
                await OwnerModel.findByIdAndUpdate(owner._id, { isCard: pdfFile })
                return res.status(200).json({ message: "Upload!" })
            } else if (type === "apartmentRule") {
                await OwnerModel.findByIdAndUpdate(owner._id, { apartmentRule: pdfFile })
                return res.status(200).json({ message: "Upload!" })
            } else if (type === "applicationForPrivate") {
                await OwnerModel.findByIdAndUpdate(owner._id, { applicationForPrivate: pdfFile })
                return res.status(200).json({ message: "Upload!" })
            } else if (type === "applicationForLicense") {
                await OwnerModel.findByIdAndUpdate(owner._id, { applicationForLicense: pdfFile })
                return res.status(200).json({ message: "Upload!" })
            }
        }
        return res.status(400).json({ message: "Error while upload" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const approveOwner = async (req, res) => {
    try {
        const { role } = req.user
        const { userId } = req.body
        if (role !== "admin") {
            return res.status(403).json({ message: "Not permission" })
        }
        const owner = await checkIsOwnerExist(userId)
        if (!owner) {
            return res.status(400).json({ message: "Invalid request" })
        }
        await OwnerModel.findByIdAndUpdate(owner._id, { approve: true })
        await updateToOwner(userId, true)
        return res.status(200).json({ message: "Approve!" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const removeOwner = async (req, res) => {
    try {
        const { role } = req.user
        const { userId } = req.body
        if (role !== "admin") {
            return res.status(403).json({ message: "Not permission" })
        }
        const owner = await checkIsOwnerExist(userId)
        if (!owner) {
            return res.status(400).json({ message: "Invalid request" })
        }
        await OwnerModel.findByIdAndUpdate(owner._id, { approve: false })
        await updateToOwner(userId, false)
        return res.status(200).json({ message: "Remove!" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = {
    requestToBeOwner,
    ownerUploadPdf,
    approveOwner,
    removeOwner
}