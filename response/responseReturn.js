const logger = require("../config/logger")

class responseReturn {}

responseReturn.prototype.success = function (req, res, statusCode, message) {
    logger.info(
        `server response success status: ${statusCode}, URL: ${req.originalUrl} (development)`
    )
    res.statusCode = statusCode
    res.json({ error: false, response: message })
    return res
}

responseReturn.prototype.failure = function (req, res, statusCode, message) {
    logger.info(
        `server response failed status: ${statusCode}, URL: ${req.originalUrl} (development)`
    )
    res.statusCode = statusCode
    res.json({ error: true, response: message })
    return res
}

module.exports = responseReturn
