const app = Vue.createApp({
  data() {
    return {
      questions: "https://opentdb.com/api.php?amount=1",
      // wrong question collection
      mistakes: [],
      // mistake id (only 2 actually)
      id: 0,
      // incorrect answer to keep track on which questions the user did wrong
      // if wrong, then when the user answer again, neither points will add, nor mistakes array will collect
      incorrectAnswers: [],
      // game's level
      level: null,
      // player's points  question worth: easy = 2, medium = 4, hard = 6
      // if their answer is wrong, deduct: easy = 1, medium = 2, hard = 3
      score: 0,
      // if no more lives is lose
      ifLoose: false,
      // lives
      lives: sessionStorage.getItem("lives"),
      // if last life
      isLastLife: false,
      // the origional data (response-code + results)
      response: null,
      // only TF questions
      results: [],
      // different question type
      isTF: true,
      isMulti: false,
      gameType: sessionStorage.getItem("questionType"),
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
        this.questions +
          "&category=" +
          this.gameType +
          "&difficulty=easy&type=boolean"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.response = data; // goal 1
          console.log("True/False choice response: ");
          console.log(this.response);
          this.results = data.results;
          this.level = this.results[0].difficulty;
        });
    },
    // Goal 2 & 3
    checkAnswer() {
      if (this.option === null) {
        this.isCorrect = false;
        this.isNull = true;
      } else if (this.option === this.results[0]["correct_answer"]) {
        let parsedLives = parseInt(this.lives, 10);
        this.lives = parsedLives;
        let parsedScore = parseInt(this.score, 10);
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          parsedScore += 2;
        }
        this.score = parsedScore;
        sessionStorage.setItem("playerScore", this.score);
        this.isCorrect = true;
        this.isNull = false;
      } else {
        let parsedLives = parseInt(this.lives, 10);
        parsedLives--;
        this.lives = parsedLives;
        let parsedScore = parseInt(this.score, 10);
        parsedScore--;
        this.score = parsedScore;
        sessionStorage.setItem("playerScore", this.score);
        sessionStorage.setItem("lives", this.lives);
        this.isCorrect = false;
        this.isNull = false;
        if (this.lives === 0) {
          this.ifLoose = true;
          this.isLastLife = true;
        }
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          const mistake = {
            mistakeID: ++this.id,
            question_name: this.results[0]["question"],
            question_type: this.results[0]["type"],
            difficulty: this.results[0]["difficulty"],
            player_answer: this.option,
            correct_ans: this.results[0]["correct_answer"],
          };
          this.mistakes.push(mistake);
          sessionStorage.setItem("mistakes", JSON.stringify(this.mistakes));
          sessionStorage.setItem("ID", this.id);
        }
        this.incorrectAnswers.push(this.results[0]["question"]);
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
    getRandomIndex() {
      const set = new Set();
      while (set.size < 4) {
        let randomNum = Math.floor(Math.random() * 4);
        set.add(randomNum);
      }
      return Array.from(set);
    },
    getMulti() {
      return fetch(
        this.questions +
          "&category=" +
          this.gameType +
          "&difficulty=easy&type=multiple"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.response = data; // goal 1
          console.log("Multiple choice response: ");
          console.log(this.response);
          this.multipleQuestion = data.results;
          const uniqueIndex = getRandomIndex();
          this.multiQs.splice(
            uniqueIndex[0],
            0,
            this.multipleQuestion[0]["correct_answer"]
          );
          this.multiQs.splice(
            uniqueIndex[1],
            0,
            this.multipleQuestion[0]["incorrect_answers"][0]
          );
          this.multiQs.splice(
            uniqueIndex[2],
            0,
            this.multipleQuestion[0]["incorrect_answers"][1]
          );
          this.multiQs.splice(
            uniqueIndex[3],
            0,
            this.multipleQuestion[0]["incorrect_answers"][2]
          );
        });
    },
    // Goal 4 & 5
    checkAnswer2() {
      if (this.multiOp === null || this.multiOp === undefined) {
        this.isCorrect = false;
        this.isNull = true;
      } else if (this.multiOp === this.multipleQuestion[0]["correct_answer"]) {
        let parsedLives = parseInt(this.lives, 10);
        this.lives = parsedLives;
        let parsedScore = parseInt(this.score, 10);
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          parsedScore += 2;
        }
        this.score = parsedScore;
        sessionStorage.setItem("playerScore", this.score);
        this.isCorrect = true;
        this.isNull = false;
      } else {
        // convert lives to integer
        let parsedLives = parseInt(this.lives, 10);
        parsedLives--;
        this.lives = parsedLives;
        // convert score to integer
        let parsedScore = parseInt(this.score, 10);
        parsedScore--;
        this.score = parsedScore;
        sessionStorage.setItem("playerScore", this.score);
        sessionStorage.setItem("lives", this.lives);
        this.isCorrect = false;
        this.isNull = false;
        if (this.lives === 0) {
          this.ifLoose = true;
          this.isLastLife = true;
        }
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          const mistake = {
            mistakeID: ++this.id,
            question_name: this.multipleQuestion[0]["question"],
            question_type: this.multipleQuestion[0]["type"],
            difficulty: this.multipleQuestion[0]["difficulty"],
            player_answer: this.multiOp,
            correct_ans: this.multipleQuestion[0]["correct_answer"],
          };
          this.mistakes.push(mistake);
          sessionStorage.setItem("mistakes", JSON.stringify(this.mistakes));
          sessionStorage.setItem("ID", this.id);
        }
        this.incorrectAnswers.push(this.results[0]["question"]);
      }
    },
    exit() {
      sessionStorage.setItem("lives", 3);
      window.location.replace("/start");
    },
  },
});

app.mount("#app");
