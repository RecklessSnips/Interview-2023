const app = Vue.createApp({
  data() {
    return {
      otherType: "",
      ifSelect: false,
    };
  },
  beforeMount() {
    this.clearMistakes();
  },
  methods: {
    start() {
      // give player lives
      sessionStorage.setItem("lives", 3);
      // check if player have choose a question type
      sessionStorage.setItem("questionType", this.otherType);
      if (this.otherType !== "") {
        window.location.href = "/easy";
      }
    },
    clearMistakes() {
      // for test simplicity, clean the session when load the page
      sessionStorage.setItem("mistakes", "");
      sessionStorage.setItem("ID", 0);
    },
  },
});

app.mount("#app");
