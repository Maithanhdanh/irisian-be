const express = require('express');
const patientRoutes = require('./patient.route');
const diagnosisRoutes = require('./diagnosis.route');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/patient', patientRoutes);
router.use('/diagnosis', diagnosisRoutes);

module.exports = router;
