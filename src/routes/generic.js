const express = require('express');
const { generic } = require('../controllers');
const { routes } = require('./static');

const router = express.Router();

router.get(routes.ROOT, generic.root);

module.exports = router;
