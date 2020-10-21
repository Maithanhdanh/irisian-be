const { body, query, param } = require("express-validator")

let addAuthUser = () => {
	return [
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["password"]).trim().exists().isString().notEmpty(),
	]
}

let loginUser = () => {
	return [
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["password"]).trim().exists().isString().notEmpty(),
	]
}

let verifiedUser = () => {
	return [
		body(["_id"]).trim().exists().isString().notEmpty(),
		body(["email"]).trim().exists().isString().notEmpty(),
		body(["role"]).trim().exists().isString().notEmpty(),
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
	loginUser:loginUser,
	addAuthUser:addAuthUser,
	verifiedUser:verifiedUser,
	searchUser: searchUser,
	getUser: getUser,
	updateUser: updateUser,
}

module.exports = { validate }
