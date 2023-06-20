const express = require('express');
const auth = require('../middlewares/auth');
const { readTalkersData } = require('../utils/fsUtils');
const searchFilter = require('../utils/searchFilter');
const validateQuery = require('../middlewares/validateQuery');
const validateRateQuery = require('../middlewares/validateRateQuery');

const router = express.Router();

router.get('/talker/search/', auth, validateQuery, (req, res, next) => {
  const { q, rate } = req.query;

  if (!rate && q) {
    // If rate doesn't exist, but q exists, go to the next middleware
    return next();
  }

  // Execute validateRateQuery only when rate is present
  validateRateQuery(req, res, next);
}, async (req, res) => {
  try {
    const { q, rate } = req.query;
    const talkers = await readTalkersData();
    const filteredTalkers = searchFilter(q, rate, talkers);

    return res.status(200).json(filteredTalkers);
  } catch (err) {
    console.log(`Erro na escrita do arquivo: ${err}`);
  }
});

module.exports = router;