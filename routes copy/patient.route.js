const express = require('express');
const controller = require('../controllers/patient.controller');
const { oAuth } = require('../middlewares/oAth');
const { validate } = require('../validation/patient.validation');
const router = express.Router();

router.route('/add')
    .post(validate.addPatient(), controller.addPatient);

router.route('/search')
    .get(oAuth ,validate.searchPatient(), controller.searchPatient);

router.route('')
    .get(validate.getPatient(), controller.getPatient);

router.route('/update')
    .post(validate.updatePatient(), controller.updatePatient);

router.route('/status')
    .get((req, res) => res.send('OK'));
module.exports = router;


