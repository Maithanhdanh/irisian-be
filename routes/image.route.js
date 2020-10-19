const express = require('express');
const controller = require('../controllers/image.controller');
const { oAuth } = require('../middlewares/oAth');
const { validate } = require('../validation/image.validation');
const router = express.Router();

router.route('/add')
    .post(oAuth ,validate.addDiagnosis(), controller.addDiagnosis);

router.route('/search')
    .post(oAuth ,validate.searchDiagnosis(), controller.searchDiagnosis);

router.route('/')
    .get(oAuth ,validate.addDiagnosis(), controller.addDiagnosis);

router.route('/status')
    .get((req, res) => res.json('OK'));
module.exports = router;


