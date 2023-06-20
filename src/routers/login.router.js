const express = require('express');
const validateEmail = require('../middlewares/validateEmail');
const validatePassword = require('../middlewares/validatePassword');
const generateToken = require('../utils/generateToken');

const router = express.Router();

router.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();

  return res.status(200).json({ token });
});

module.exports = router;