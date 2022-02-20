const express = require('express');
const { users } = require('../controllers');
const { routes } = require('./static');

const router = express.Router();

router.post(routes.SIGNUP, users.postSignup);
router.post(routes.AUTH, users.postLogin);

module.exports = router;
