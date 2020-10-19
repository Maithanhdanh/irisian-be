const express = require('express');
const controller = require('../controllers/diagnosis.controller');
const { oAuth } = require('../middlewares/oAth');
const { validate } = require('../validation/diagnosis.validation');
const router = express.Router();

router.route('/add')
    .post(oAuth ,validate.addDiagnosis(), controller.addDiagnosis);

router.route('/search')
    .post(oAuth ,validate.searchDiagnosis(), controller.searchDiagnosis);

router.route('/')
    .get(oAuth ,validate.addDiagnosis(), controller.addDiagnosis);

router.route('/status')
    .get((req, res) => res.send('OK'));
module.exports = router;


