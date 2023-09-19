const app = Vue.createApp({
  data() {
    return {
      // the origional data (response-code + results)
      response: null,
      // only TF questions
      results: [],
      // different question type
      isTF: true,
      isMulti: false,
      // only multi question
      multipleQuestion: [],
      // both true and false answers
      multiQs: [],
      // user's choice for TF
      option: null,
      // user's choice for multi
      multiOp: null,
      // if user chosed
      isNull: true,
      // if answer correct
      isCorrect: false,
    };
  },
  beforeMount() {
    this.getQuestion();
    this.getMulti();
  },
  methods: {
    getQuestion() {
      return fetch(
        "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=boolean"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.response = data; // goal 1
          this.results = data.results;
        });
    },
    goal1() {
      console.log(this.response);
    },
    // Goal 2 & 3
    checkAnswer() {
      // to remove ->
      console.log(this.option);
      console.log(this.results[0]["correct_answer"]);
      const btn = document.getElementById("TFBtn");
      if (this.option === null) {
        this.isCorrect = false;
        this.isNull = true;
      } else if (this.option === this.results[0]["correct_answer"]) {
        btn.removeAttribute("disabled");
        this.isCorrect = true;
        this.isNull = false;
      } else {
        this.isCorrect = false;
        this.isNull = false;
      }
    },
    switchToMulti() {
      this.isMulti = true;
      this.isTF = false;
    },
    switchToTF() {
      this.isMulti = false;
      this.isTF = true;
    },
    getMulti() {
      return fetch(
        "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.multipleQuestion = data.results;
          console.log(this.multipleQuestion);
          const randomIndex = Math.floor(Math.random() * 4);
          const randomIndex2 = Math.floor(Math.random() * 4);
          const randomIndex3 = Math.floor(Math.random() * 4);
          const randomIndex4 = Math.floor(Math.random() * 4);
          this.multiQs.splice(
            randomIndex,
            0,
            this.multipleQuestion[0]["correct_answer"]
          );
          this.multiQs.splice(
            randomIndex2,
            0,
            this.multipleQuestion[0]["incorrect_answers"][0]
          );
          this.multiQs.splice(
            randomIndex3,
            0,
            this.multipleQuestion[0]["incorrect_answers"][1]
          );
          this.multiQs.splice(
            randomIndex4,
            0,
            this.multipleQuestion[0]["incorrect_answers"][2]
          );
        });
    },
    // Goal 4 & 5
    checkAnswer2() {
      // to remove ->
      console.log(this.multiOp);
      console.log(this.multipleQuestion[0]["correct_answer"]);

      const btn = document.getElementById("multiBtn");
      if (this.multiOp === null || this.multiOp === undefined) {
        this.isCorrect = false;
        this.isNull = true;
      } else if (this.multiOp === this.multipleQuestion[0]["correct_answer"]) {
        btn.removeAttribute("disabled");
        this.isCorrect = true;
        this.isNull = false;
      } else {
        this.isCorrect = false;
        this.isNull = false;
      }
    },
  },
});

app.mount("#app");
