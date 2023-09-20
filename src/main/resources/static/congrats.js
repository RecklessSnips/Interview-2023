const app = Vue.createApp({
  data() {
    return {
      // total score: 24: 24 -> A++  { 22 ~ 23 = A+} -> { 19 ~ 21 = A}
      // -> {18 = B+} -> { 17 = B} -> { 16 = C+} -> {15 = C} -> { 14 = D+} -> { 13 ~ 12 = D}
      score: sessionStorage.getItem("playerScore"),
      lives: sessionStorage.getItem("lives"),
      isFullScore: false,
      // get all the user's mistakes
      mistakes: JSON.parse(sessionStorage.getItem("mistakes")),
      // get mistakes ids
      ids: [],
    };
  },
  beforeMount() {
    this.getID();
  },
  methods: {
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
    getID() {
      for (const element of this.mistakes) {
        this.ids.push(element.mistakeID);
      }
    },
  },
});

app.mount("#app");
