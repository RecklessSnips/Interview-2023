export const commonMethods = {
  parsedLives(live) {
    return parseInt(live, 10);
  },

  parsedScore(score) {
    return parseInt(score, 10);
  },

  sessionStore(item, value) {
    sessionStorage.setItem(item, value);
  },

  // prepare to randomly the answer's index
  getRandomIndex() {
    const set = new Set();
    while (set.size < 4) {
      let randomNum = Math.floor(Math.random() * 4);
      set.add(randomNum);
    }
    // convert the set to an unique array
    return Array.from(set);
  },
};
