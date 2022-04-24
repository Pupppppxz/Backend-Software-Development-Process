const express = require("express");

const { validateJWT, singleImageUpload, uploadArrayImage, singlePdfUpload } = require("./middleware")

const Router = express.Router();
const AuthController = require("./controllers/auth.js");
const ApartmentController = require("./controllers/apartment.js");
const RoomController = require("./controllers/room")
const ReviewController = require("./controllers/review")
const NotificationController = require("./controllers/notification")
const UserController = require("./controllers/user")
const OwnerController = require("./controllers/owner")

Router.get("/", (req, res) =>
  res
    .send("Hello guys, this is backend for software development process project !")
    .status(200)
);

// authentication
Router.post("/login", AuthController.login);
Router.post("/register", AuthController.register);

// user
Router.get("/user", validateJWT, UserController.getUserById)
Router.put("/user", validateJWT, UserController.updateUserDetail)
Router.put("/password", validateJWT, UserController.updatePassword)

// apartment -- owner
Router.post("/apmnt", validateJWT, singleImageUpload, ApartmentController.createController);
Router.put("/apmnt", validateJWT, ApartmentController.updateController);
Router.put("/apmnt-image", validateJWT, singleImageUpload, ApartmentController.updateImageController);
Router.delete("/apmnt", validateJWT, ApartmentController.deleteController);
Router.get("/apmnt-owner", validateJWT, ApartmentController.getOwnerApartment);
Router.get("/apmnt-owner-room", validateJWT, ApartmentController.getOwnerApartmentAndRoom);

// apartment -- user
Router.get("/apmnt-name/:name", validateJWT, ApartmentController.getByNameController);
Router.get("/apmnt-id/:id", validateJWT, ApartmentController.getByIdController);
Router.get("/apmnt-all", validateJWT, ApartmentController.getAllController);

// room -- owner
Router.post("/room", validateJWT, uploadArrayImage, RoomController.createRoomTypeController)
Router.put("/room", validateJWT, RoomController.updateRoomTypeController)
Router.delete("/room", validateJWT, RoomController.deleteRoomTypeController)
Router.put("/room-image", validateJWT, uploadArrayImage, RoomController.updateRoomImageController)
Router.post("/room-insert", validateJWT, RoomController.insertRoomController)
Router.delete("/room-delete", validateJWT, RoomController.deleteRoomController)
Router.put("/room-update", validateJWT, RoomController.updateAvailableRoomController)

// review
Router.post("/review", validateJWT, ReviewController.createReview)
Router.get("/review/:apartmentId", validateJWT, ReviewController.getReviewByApartmentId)
Router.delete("/review", validateJWT, ReviewController.deleteReview)
Router.put("/review", validateJWT, ReviewController.updateReview)
Router.get("/review-all", validateJWT, ReviewController.getAllReview)


Router.get("/noti-admin", validateJWT, NotificationController.getAllNotification)
Router.get("/noti-customer", validateJWT, NotificationController.getNotificationByCustomerId)
Router.get("/noti-owner", validateJWT, NotificationController.getAllNotificationByOwnerId)
Router.put("/noti-owner", validateJWT, NotificationController.approveRejectNotification)
Router.post("/noti-new", validateJWT, NotificationController.createNotification)
Router.post("/noti-reply", validateJWT, NotificationController.createReplyMessage)
Router.post("/noti-offer", validateJWT, NotificationController.createNewOfferTime)
// Router.post("/noti-customer", validateJWT, NotificationController.getNotificationByCustomerId)

// request to owner
Router.post("/owner", validateJWT, OwnerController.requestToBeOwner)
Router.get("/owner", validateJWT, OwnerController.checkIsRequestToOwner)
Router.put("/owner", validateJWT, singlePdfUpload, OwnerController.ownerUploadPdf)
Router.put("/owner-approve", validateJWT, OwnerController.approveOwner)
Router.post("/owner-remove", validateJWT, OwnerController.removeOwner)
Router.get("/owner-admin", validateJWT, OwnerController.getAllRequest)

module.exports = Router;
