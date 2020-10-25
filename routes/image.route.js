const express = require("express")
const controller = require("../controllers/image.controller")
const { oAuth } = require("../middlewares/oAuth")
const {
	uploadImage,
	verifyImage,
	getFindings,
	getInfo,
} = require("../middlewares/image")
const { validate } = require("../validation/image.validation")
const router = express.Router()
const multer = require("multer")
const mongoose = require("mongoose")
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/")
	},
	filename: function (req, file, cb) {
		cb(null, mongoose.Types.ObjectId() + ".jpg") //Appending .jpg
	},
})

const upload = multer({ storage: storage })

router
	.route("/upload")
	.post(
		oAuth,
		upload.single("file"),
		verifyImage,
		uploadImage,
		controller.importImage
	)

router
	.route("/info/:imageId")
	.get(
		oAuth,
		validate.authInfo(),
		getInfo,
		validate.infoImage(),
		controller.importInfo
	)

router
	.route("/findings/:imageId")
	.get(
		oAuth,
		validate.authInfo(),
		getFindings,
		validate.findingsImage(),
		controller.importFindings
	)

router
	.route("/get/:imageId")
	.get(oAuth, validate.getImage(), controller.getImage)

router
	.route("/getList")
	.get(oAuth, validate.getList(), controller.getList)

router.route("/status").get((req, res) => res.json("OK"))
module.exports = router
