const { NotificationModel, UserModel } = require("../models")
const { setMessageToRead } = require("../services/notification")

const createNotification = async (req, res) => {
    try {
        const { role, id: customerId, fullname: nameCustomer, phone: contactCustomer } = req.user
        const { apartmentId, roomType, rentalFee, area, leaseAgreement, cashPledge, locationX, locationY, ownerId, dateTrans, timeTrans, apartmentName } = req.body
        if (role !== "customer") {
            return res.status(403).json({ message: "Not permission" })
        }
        if (!apartmentId || !roomType || !rentalFee || !area || !leaseAgreement || !cashPledge || !locationX || !locationY || !ownerId) {
            return res.status(400).json({ message: "Please complete all field!" })
        }
        const owner = await UserModel.findOne({ _id: ownerId })
        const newNotification = new NotificationModel({
            customerId,
            ownerId,
            apartmentId,
            nameCustomer,
            nameOwner: owner.firstName+owner.lastName,
            contactCustomer,
            contactOwner: owner.phone,
            roomType,
            rentalFee,
            area,
            leaseAgreement,
            cashPledge,
            locationX,
            locationY,
            message: `Request to see the room at [Apartment]: ${apartmentName}`,
            from: role,
            dateTrans,
            timeTrans
        })
        newNotification
            .save()
            .then(() => res.status(201).json({ message: "Create!" }))
            .catch(e => {
                console.log(e)
                return res.status(400).json({ message: "Error while create new notification" })
            })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const createReplyMessage = async (req, res) => {
    try {
        const { role } = req.user
        const { notificationId, message } = req.body
        const notification = await NotificationModel.findOne({ _id:notificationId })
        if (notification) {
            if (notification.statusAccept || notification.statusCancel) {
                return res.status(400).json({ message: "Cannot modify" })
            }
            const chat = await setMessageToRead(notification.chat, role)
            const monthArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
            const date = new Date()
            const dateTrans = [date.getDate(), monthArr[date.getMonth(), date.getFullYear()]].join(" ")
            const timeTrans = date.getHours() < 12 ? date.getHours() + " a.m." : date.getHours() - 11 + " p.m."
            chat.push({
                message,
                time: date,
                dateTrans,
                timeTrans,
                from: role,
                isRead: false
            })
            await NotificationModel.findByIdAndUpdate(notificationId, { chat: chat })
            return res.status(200).json({ message: "Message has been Send!" })
        } else {
            return res.status(400).json({ message: "Error while reply message" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const createNewOfferTime = async (req, res) => {
    try {
        const { role } = req.user
        const { notificationId, apartmentId, dateTrans, timeTrans, accept, cancel } = req.body
        if (!apartmentId || !notificationId || !dateTrans || !timeTrans || !accept || !cancel) {
            return res.status(400).json({ message: "Please complete all field!" })
        }
        const notification = await NotificationModel.findOne({ _id:notificationId })
        let message
        if (role === "owner" && !accept && !cancel) {
            message = `Reply new date from owner at ${dateTrans}, ${timeTrans}`
        } else if (role === "owner" && accept) {
            notification.statusAccept = true
            message = `Confirm date from owner at ${dateTrans}, ${timeTrans}`
        } else if (role === "owner" && cancel) {
            notification.statusCancel = true
            message = `Request was cancel by owner`
        } else if (role === "customer") {
            message = `Reply new date from customer at ${dateTrans}, ${timeTrans}`
        } else {
            return res.status(400).json({ message: "Error while reply message" })
        }
        if (notification) {
            const chat = await setMessageToRead(notification.chat, role)
            chat.push({
                message,
                time: new Date(),
                dateTrans,
                timeTrans,
                from: role,
                isRead: false
            })
            await NotificationModel.findByIdAndUpdate(notificationId, { chat: chat })
            return res.status(200).json({ message: "Message has been Send!" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getAllNotification = async (req, res) => {
    try {
        const { role } = req.user
        if (role !== "admin") {
            return res.status(403).json({ message: "Not permission" })
        }
        const notification = await NotificationModel.find({})
        return res.status(200).send(notification)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getAllNotificationByOwnerId = async (req, res) => {
    try {
        const { role, id: ownerId } = req.user
        if (role !== "owner") {
            return res.status(403).json({ message: "Not permission" })
        }
        const notification = await NotificationModel.find({ ownerId })
        return res.status(200).send(notification)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getNotificationByCustomerId = async (req, res) => {
    try {
        const { role, id: customerId } = req.user
        if (role !== "customer") {
            return res.status(403).json({ message: "Not permission" })
        }
        const notification = await NotificationModel.find({ customerId })
        return res.status(200).send(notification)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = {
    createNotification,
    createReplyMessage,
    createNewOfferTime,
    getAllNotification,
    getAllNotificationByOwnerId,
    getNotificationByCustomerId
}