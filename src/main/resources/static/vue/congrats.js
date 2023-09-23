const app = Vue.createApp({
  data() {
    return {
      score: sessionStorage.getItem("playerScore"),
      lives: sessionStorage.getItem("lives"),
      isFullScore: false,
      // get all the user's mistakes
      mistakes: null,
      // get mistakes ids
      ids: [],
    };
  },
  beforeMount() {
    this.getMistake();
    this.getID();
  },
  methods: {
    getMistake() {
      const storedMistakes = sessionStorage.getItem("mistakes");
      this.mistakes = storedMistakes ? JSON.parse(storedMistakes) : [];
    },
    getID() {
      if (this.mistakes !== null) {
        for (const element of this.mistakes) {
          this.ids.push(element.mistakeID);
        }
      }
    },
    getGrade() {
      let parsedScore = parseInt(this.score, 10);
      this.score = parsedScore;
      if (this.score === 24) {
        this.isFullScore = true;
        return "A++";
      } else if (this.score <= 23 && this.score >= 20) {
        return "A+";
      } else if (this.score <= 19 && this.score >= 17) {
        return "A";
      } else if (this.score <= 16 && this.score >= 14) {
        return "B+";
      } else if (this.score <= 13 && this.score >= 11) {
        return "B";
      } else if (this.score === 10) {
        return "C+";
      } else if (this.score === 9) {
        return "C";
      } else if (this.score === 8) {
        return "D+";
      } else if (this.score <= 7) {
        return "D";
      }
    },
    // create all mistakes id, store them into the ids array

  },
});

app.mount("#app");
