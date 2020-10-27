const path = require("path")

// <!-- Load environment variables based on running environment -->
if (process.env.NODE_ENV.trim() !== "production") {
	if (process.env.NODE_ENV.trim() === "test") {
		require("dotenv").config({
			path: path.join(__dirname, "../test.env"),
		})
	} else {
		require("dotenv").config({
			path: path.join(__dirname, "../.env"),
		})
	}
}

// <!-- Mapping variables -->
module.exports = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	MONGODB_URL: process.env.MONGODB_URL,
	AUTHENTICATE_URL: process.env.AUTHENTICATE_URL,
	MACHINE_LEARNING_URL: process.env.MACHINE_LEARNING_URL,
	AUTHENTICATE_URL_DEV: process.env.AUTHENTICATE_URL_DEV,
	SESSION_SECRET: process.env.SESSION_SECRET,
	DATE_FORMAT: "DD_MM_YYYY",
	SEARCH_IMAGE_THRESHOLD: 0.75,
	REFRESH_TOKEN_COOKIE_EXPIRATION: process.env.REFRESH_TOKEN_COOKIE_EXPIRATION,
}
