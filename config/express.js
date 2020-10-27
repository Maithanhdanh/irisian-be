const express = require("express")
const path = require("path")
const session = require("express-session")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const router = require("../routes/index")
const cookieParser = require("cookie-parser")
const rfs = require("rotating-file-stream")
const ENV_VAR = require("./vars")

// <!-- stream cycle of API log file -->
const accessLogStream = rfs.createStream("access.log", {
	interval: "30d", // rotate monthly
	path: path.join(__dirname, "../"),
})

// <!-- middleware -->
app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())

// <!-- public directory -->
app.use(express.static("coverage"))
app.use(express.static("public/img"))

// <!-- format of API log based on environment -->
if (ENV_VAR.NODE_ENV !== "test") {
	if (ENV_VAR.NODE_ENV === "production") {
		app.use(morgan("combined", { stream: accessLogStream }))
	} else {
		app.use(morgan("dev", { stream: accessLogStream }))
	}
}

// <!-- server session -->
app.use(
	session({
		secret: ENV_VAR.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

// <!-- base router -->
app.use("/", router)

const server = require("http").Server(app)

module.exports = server
