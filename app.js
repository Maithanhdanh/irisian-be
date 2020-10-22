const logger = require('./config/logger');
const server = require("./config/express");
const mongoose = require('./config/mongoose');
const ENV_VAR = require('./config/vars')

const port = ENV_VAR.PORT || 6000;

mongoose.connect();

server.listen(port, () => logger.info(`server started on port ${port} (development)`));

module.exports = server;