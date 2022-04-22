const { UserModel } = require("../models")
const bcrypt = require("bcrypt")
const sha256 = require("sha256")

const updateUserDetail = async (req, res) => {
    try {
        const { firstName, lastName, email, gender, phone } = req.body
        const { id } = req.user
        if (!firstName || !lastName || !email || !gender || !phone) {
            return res.status(400).json({ message: "Please complete all field" })
        }
        await UserModel.findByIdAndUpdate(id, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            phone: phone
        })
            .then(() => res.status(204).json({ message: "Updated!" }))
            .catch(e => {
                console.log(e)
                return res.status(400).json({ message: "Error while update" })
            })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { id } = req.user
        const { password, password2 } = req.body
        if (password !== password2) {
            return res.status(400).json({ message: "Password must match" })
        }
        // eslint-disable-next-line no-undef
        const salt = parseInt(process.env.SALT, 10);
        const newPassword = await bcrypt.hash(sha256(password), salt)
        if (newPassword) {
            await UserModel.findByIdAndUpdate(id, { password: newPassword })
                .then(() => res.status(204).json({ message: "Updated!" }))
                .catch(e => {
                    console.log(e)
                    return res.status(400).json({ message: "Error while update" })
                })
        }
    } catch (e) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.user
        const user = await UserModel.findOne({ _id: id })
        return res.status(200).send({
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.firstName + " " + user.lastName,
            email: user.email,
            gender: user.gender,
            phone: user.phone
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = {
    updateUserDetail,
    updatePassword,
    getUserById
}