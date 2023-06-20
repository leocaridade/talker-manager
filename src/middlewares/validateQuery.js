const { readTalkersData } = require('../utils/fsUtils');

module.exports = async (req, res, next) => {
  const { q, rate } = req.query;
  const talkers = await readTalkersData();

  if (!q && !rate) return res.status(200).json(talkers);

  next();
};