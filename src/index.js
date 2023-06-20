const express = require('express');
const {
  readTalkersData,
  writeNewTalkerData,
  updateTalkerData,
  deleteTalkerData,
} = require('./utils/fsUtils');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();
  return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkersData();
  const talker = talkers.find((e) => e.id === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();

  return res.status(200).json({ token });
});

app.post('/talker',
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

app.put('/talker/:id',
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

app.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerData(Number(id));

  return res.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});