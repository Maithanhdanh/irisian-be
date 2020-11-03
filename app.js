const logger = require("./config/logger")
const server = require("./config/express")
const mongoose = require("./config/mongoose")
const ENV_VAR = require("./config/vars")
const fs = require("fs")

const port = ENV_VAR.PORT || 6000
const host = ENV_VAR.HOST || 'localhost'

mongoose.connect()

server.listen(port, host, () =>
	logger.info(`server started on host ${host} port ${port} (${ENV_VAR.NODE_ENV})`)
)

// check if directory exists
const dir = "./uploads"

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir)
	logger.info(`Create directory "${dir}" duel to handle images upload`)
}

module.exports = server
