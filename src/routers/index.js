const express = require('express');

const router = express.Router();

const talkerRouter = require('./talker.router');
const loginRouter = require('./login.router');
const talkerSearchRouter = require('./talkerSearch.router');

router.use(talkerSearchRouter);
router.use(talkerRouter);
router.use(loginRouter);

module.exports = router;