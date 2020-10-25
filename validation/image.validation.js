const { param, body, query } = require("express-validator");

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

let getList = () => {
  return [
    body(["userId"]).exists().isString().notEmpty(),
    query(["page"]).exists().isString(),
    query(["perPage"]).exists().isString(),
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
  getList:getList,
  getImage:getImage,
  authInfo:authInfo,
  infoImage: infoImage,
  findingsImage: findingsImage,
};

module.exports = { validate };
