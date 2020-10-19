const express = require('express');
const userRoutes = require('./user.route');
const imageRoutes = require('./image.route');

const router = express.Router();

router.get('/status', (req, res) => res.json('OK'));

router.use('/user', userRoutes);
// router.use('/image', imageRoutes);

module.exports = router;
