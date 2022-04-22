const { ReviewModel } = require("../models")
const { checkIsReviewExist } = require("../services/review")

const createReview = async (req, res) => {
    try {
        const { apartmentId, score, detail } = req.body
        const { fullname: nameUser, id: userId, role } = req.user
        if (role !== "customer") {
            return res.status(403).json({ message: "Cannot create review!" })
        }
        if (!apartmentId || !score || !detail) {
            return res.status(400).json({ message: "Please fill out all information!" })
        }
        const checkIsExist = await checkIsReviewExist(userId, apartmentId)
        if (checkIsExist) {
            return res.status(400).json({ message: "Already exist!" })
        }
        const newReview = new ReviewModel({
            apartmentId,
            score,
            detail,
            nameUser,
            userId
        })
        newReview
            .save()
            .then(() => res.status(201).json({ message: "Create review" }))
            .catch(e => {
                console.log(e)
                return res.status(400).json({ message: "Error while create new review" })
            })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body
        const { role } = req.user
        if (role !== "admin") {
            return res.status(403).json({ message: "Cannot modify!" })
        }
        if (!reviewId) {
            return res.status(400).json({ message: "Please fill out all information!" })
        }
        const delReview = await ReviewModel.findByIdAndDelete(reviewId)
        if (delReview) {
            return res.status(200).json({ message: "Deleted!" })
        }
        return res.status(400).json({ message: "Error while delete!" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getReviewByApartmentId = async (req, res) => {
    try {
        const { apartmentId } = req.params
        const allReview = await ReviewModel.find({ apartmentId: apartmentId })
        console.log("all review = " + allReview)
        return res.status(200).send(allReview)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong!" })
    }
}

const updateReview = async (req, res) => {
    try {
        const { score, detail, reviewId } = req.body
        const { role } = req.user
        if (role !== "admin") {
            return res.status(403).json({ message: "Cannot modify!" })
        }
        if (!score || !detail || !reviewId) {
            return res.status(400).json({ message: "Please fill out all information!" })
        }
        const updateReview = await ReviewModel.findByIdAndUpdate(reviewId, { score, detail })
        if (updateReview) {
            return res.status(200).json({ message: "Updated!" })
        }
        return res.status(400).json({ message: "Error while update" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getAllReview = async (req, res) => {
    try {
        const allReview = await ReviewModel.find({})
        return res.status(200).send(allReview)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = {
    createReview,
    deleteReview,
    getReviewByApartmentId,
    updateReview,
    getAllReview
}