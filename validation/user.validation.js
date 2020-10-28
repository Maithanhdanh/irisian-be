const { body, query, param, cookie } = require("express-validator")

//<!-- Add user -->
let addAuthUser = () => {
	return [
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["password"]).trim().exists().isString().notEmpty(),
	]
}

//<!-- Get new token -->
let token = () => {
	return [cookie(["refresh_token"]).exists().notEmpty()]
}

//<!-- Log in -->
let loginUser = () => {
	return [
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["password"]).trim().exists().isString().notEmpty(),
	]
}

//<!-- verify for middleware of add user route -->
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
//<!-- verify for middleware of log in user route -->
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
//<!-- Search list users -->
let searchUser = () => {
	return [
		query(["email"]).trim().exists().isString(),
		query(["name"]).trim().exists().isString(),
		body(["userId"]).exists().notEmpty(),
	]
}

//<!-- get an user -->
let getUser = () => {
	return [
		param(["id"]).trim().exists().isString().notEmpty(),
		body(["userId"]).exists().notEmpty(),
	]
}

//<!-- Update user -->
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
