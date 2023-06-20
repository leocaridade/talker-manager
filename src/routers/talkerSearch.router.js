const express = require('express');
const auth = require('../middlewares/auth');
const { readTalkersData } = require('../utils/fsUtils');

const router = express.Router();

router.get('/talker/search/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const talkers = await readTalkersData();

    if (!q || q == null) {
      res.status(200).json(talkers);
    } else {
      const filteredTalkers = talkers.filter((talker) => talker.name.includes(q));
      return res.status(200).json(filteredTalkers);
    }
  } catch (err) {
    console.log(`Erro na escrita do arquivo: ${err}`);
  }
});

module.exports = router;