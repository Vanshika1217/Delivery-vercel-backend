const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/AdminController');

router.post('/add', adminController.register);
router.post('/login', adminController.login);
router.get('/dashboard', adminController.dashboard);

module.exports = router;
