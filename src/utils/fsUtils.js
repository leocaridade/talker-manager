const fs = require('fs').promises;
const path = require('path');

async function readTalkersData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const talkers = JSON.parse(data);
    return talkers || [];
  } catch (err) {
    console.log(`Erro na leitura do arquivo: ${err}`);
  }
}

async function writeNewTalkerData(newTalker) {
  try {
    const talkers = await readTalkersData();
    const id = talkers[talkers.length - 1].id + 1;
    const newTalkerWithId = { id, ...newTalker };
    const allTalkers = JSON.stringify([...talkers, newTalkerWithId], null, 2);

    await fs.writeFile(path.resolve(__dirname, '../talker.json'), allTalkers);
    return newTalkerWithId;
  } catch (err) {
    console.log(`Erro na escrita do arquivo: ${err}`);
  }
}

module.exports = {
  readTalkersData,
  writeNewTalkerData,
};
