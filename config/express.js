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

const accessLogStream = rfs.createStream("access.log", {
	interval: "30d", // rotate daily
	path: path.join(__dirname, "../"),
})



app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())

if (ENV_VAR.NODE_ENV !== "test") {
	if (ENV_VAR.NODE_ENV === "production") {
		app.use(morgan("combined", { stream: accessLogStream }))
	} else {
		app.use(morgan("dev", { stream: accessLogStream }))
	}
}

app.use(
	session({
		secret: ENV_VAR.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

app.use("/", router)

const server = require("http").Server(app)

module.exports = server
