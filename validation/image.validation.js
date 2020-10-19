const { header, body, param, query } = require("express-validator");

let addDiagnosis = () => {
  return [
    body(["patient_id"]).trim().exists().isString().notEmpty(),
    body(["symptoms"]).exists().isArray().notEmpty(),
    body(["medicine"]).isArray().exists().notEmpty(),
    body(["numDates"]).trim().exists().isString().notEmpty(),
    body(["userId"]).exists().notEmpty(),
  ];
};

let searchDiagnosis = () => {
  return [
    body(["diagnosis_id"]).exists().isArray(),
  ];
};

let validate = {
    addDiagnosis: addDiagnosis,
    searchDiagnosis: searchDiagnosis,
};

module.exports = { validate };
