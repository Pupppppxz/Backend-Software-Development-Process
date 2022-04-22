// const { NotificationModel } = require("../models")

const setMessageToRead = async (message, role) => {
    try {
        message.map(async (val) => {
            if (val.from !== role) {
                val.isRead = true
            }
        })
        console.log(message)
        
    } catch (e) {
        return
    }
}

module.exports = {
    setMessageToRead
}