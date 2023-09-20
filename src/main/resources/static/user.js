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
      sessionStorage.setItem("lives", 3);
      sessionStorage.setItem("questionType", this.otherType);
      if (this.otherType !== "") {
        window.location.href = "/easy";
      }
    },
    clearMistakes() {
      sessionStorage.setItem("mistakes", "");
      sessionStorage.setItem("ID", 0);
    },
  },
});

app.mount("#app");
