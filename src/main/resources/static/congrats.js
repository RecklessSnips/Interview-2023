const app = Vue.createApp({
  data() {
    return {
      // total score: 24: 24 -> A++  { 22 ~ 23 = A+} -> { 19 ~ 21 = A}
      // -> {18 = B+} -> { 17 = B} -> { 19 ~ 23 = A+} -> { 16 = C+} -> {15 = C} -> { 14 = D+} -> { 13 ~ 12 = D}
      score: sessionStorage.getItem("playerScore"),
      lives: sessionStorage.getItem("usedLive"),
    };
  },
});

app.mount("#app");
