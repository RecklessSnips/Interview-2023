const app = Vue.createApp({
  data() {
    return {};
  },
  methods: {
    genereteQuestion() {
      fetch("https://opentdb.com/api.php?amount=10&category=10").then();
    },
  },
});
