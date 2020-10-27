const { body, query, param, cookie } = require("express-validator")

let addAuthUser = () => {
	return [
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["password"]).trim().exists().isString().notEmpty(),
	]
}

let token = () => {
	return [cookie(["refresh_token"]).exists().notEmpty()]
}

let loginUser = () => {
	return [
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["password"]).trim().exists().isString().notEmpty(),
	]
}

let verifiedUserForNewUser = () => {
	return [
		body(["_id"]).trim().exists().isString().notEmpty(),
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["name"]).trim().exists().isString().notEmpty(),
		body(["role"]).trim().exists().isString().notEmpty(),
		body(["accessToken"]).trim().exists().isString().notEmpty(),
		body(["expiresIn"]).trim().exists().isNumeric().notEmpty(),
		body(["refreshToken_expiresIn"]).trim().exists().isNumeric().notEmpty(),
		body(["refreshToken"]).exists().isString().notEmpty(),
	]
}

let verifiedUserForLogin = () => {
	return [
		body(["_id"]).trim().exists().isString().notEmpty(),
		body(["role"]).trim().exists().isString().notEmpty(),
		body(["accessToken"]).trim().exists().isString().notEmpty(),
		body(["expiresIn"]).trim().exists().isNumeric().notEmpty(),
		body(["refreshToken_expiresIn"]).trim().exists().isNumeric().notEmpty(),
		body(["refreshToken"]).exists().isString().notEmpty(),
	]
}

let searchUser = () => {
	return [
		query(["email"]).trim().exists().isString(),
		query(["name"]).trim().exists().isString(),
		body(["userId"]).exists().notEmpty(),
	]
}

let getUser = () => {
	return [
		param(["id"]).trim().exists().isString().notEmpty(),
		body(["userId"]).exists().notEmpty(),
	]
}

let updateUser = () => {
	return [
		body(["userId"]).exists().notEmpty(),
		body(["name"]).trim().exists().isString(),
		body(["avatar"]).trim().exists().isString(),
	]
}

let validate = {
	token: token,
	loginUser: loginUser,
	addAuthUser: addAuthUser,
	verifiedUserForNewUser: verifiedUserForNewUser,
	verifiedUserForLogin: verifiedUserForLogin,
	searchUser: searchUser,
	getUser: getUser,
	updateUser: updateUser,
}

module.exports = { validate }
