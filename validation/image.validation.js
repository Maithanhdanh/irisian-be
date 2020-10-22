const { param, body } = require("express-validator");

let authInfo = () => {
  return [
    body(["userId"]).exists().isString().notEmpty(),
  ];
};

let getImage = () => {
  return [
    body(["userId"]).exists().isString().notEmpty(),
    param(["imageId"]).exists().isString().notEmpty(),
  ];
};

let infoImage = () => {
  return [
    param(["imageId"]).exists().isString().notEmpty(),
    body(["userId"]).exists().isString().notEmpty(),
    body(["info"]).exists().notEmpty(),
  ];
};

let findingsImage = () => {
  return [
    param(["imageId"]).exists().isString().notEmpty(),
    body(["userId"]).exists().isString().notEmpty(),
    body(["findings"]).exists().notEmpty(),
  ];
};

let validate = {
  getImage:getImage,
  authInfo:authInfo,
  infoImage: infoImage,
  findingsImage: findingsImage,
};

module.exports = { validate };
