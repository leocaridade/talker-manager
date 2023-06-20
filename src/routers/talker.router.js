const express = require('express');
const {
  readTalkersData,
  writeNewTalkerData,
  updateTalkerData,
  deleteTalkerData,
} = require('../utils/fsUtils');
const auth = require('../middlewares/auth');
const validateName = require('../middlewares/validateName');
const validateAge = require('../middlewares/validateAge');
const validateTalk = require('../middlewares/validateTalk');
const validateWatchedAt = require('../middlewares/validateWatchedAt');
const validateRate = require('../middlewares/validateRate');

const router = express.Router();

router.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();
  return res.status(200).json(talkers);
});

router.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkersData();
  const talker = talkers.find((e) => e.id === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).json(talker);
});

router.post('/talker',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const { watchedAt, rate } = talk;

    const newTalker = {
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };

    const newTalkerWithId = await writeNewTalkerData(newTalker);

    return res.status(201).json(newTalkerWithId);
});

router.put('/talker/:id',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const updatedTalkerData = req.body;
    const updatedTalker = await updateTalkerData(Number(id), updatedTalkerData);

    const talkers = await readTalkersData();
    const isIdValid = talkers.find((talker) => talker.id === Number(id));

    if (!isIdValid) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    } 

    return res.status(200).json(updatedTalker);
});

router.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerData(Number(id));

  return res.status(204).end();
});

module.exports = router;