const express = require("express")
const controller = require("../controllers/user.controller")
const { oAuth, oRegis, Login, oGetToken } = require("../middlewares/oAuth")
const { validate } = require("../validation/user.validation")
const router = express.Router()

router
	.route("/add")
	.post(
		validate.addAuthUser(),
		oRegis,
		validate.verifiedUserForNewUser(),
		controller.addUser
	)

router.route("/token").get(validate.token(), oGetToken, controller.getToken)
router.route("/logout").get(validate.token(), controller.RemoveToken)
router
	.route("/login")
	.post(
		validate.loginUser(),
		Login,
		validate.verifiedUserForLogin(),
		controller.loginUser
	)

router.route("/search").get(oAuth, validate.searchUser(), controller.searchUser)

router.route("/get/:id").get(oAuth, validate.getUser(), controller.getUser)

router
	.route("/update")
	.post(oAuth, validate.updateUser(), controller.updateUser)

router.route("/status").get((req, res) => res.json("OK"))
module.exports = router
