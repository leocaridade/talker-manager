function searchFilter(q, rate, talkers) {
  let filteredTalkers = talkers;
  if (q) {
    filteredTalkers = filteredTalkers.filter((talker) => talker.name.includes(q));
  }
  if (rate) {
    filteredTalkers = filteredTalkers.filter(({ talk }) => talk.rate === +rate);
  }
  return filteredTalkers;
}

module.exports = searchFilter;