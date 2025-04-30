const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/login');
const userRegister = require('../controllers/signup');

router.post('/login', userLogin.login);
router.post('/signup', userRegister.signup);

module.exports = router;