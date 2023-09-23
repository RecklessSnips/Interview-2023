import { commonMethods } from "/vue/common.js";

const app = Vue.createApp({
  data() {
    return {
      ...commonMethods,
      questions: "https://opentdb.com/api.php?amount=1",
      response: null,
      results: [],
      multipleQuestion: [],
      multiQs: [],
      mistakes: null,
      id: null,
      incorrectAnswers: [],
      incorrectMulti: [],
      level: null,
      ifLoose: false,
      isLastLife: false,
      isTF: true,
      isMulti: false,
      option: null,
      multiOp: null,
      isNull: true,
      isCorrect: false,
      score: sessionStorage.getItem("playerScore"),
      lives: sessionStorage.getItem("lives"),
      gameType: sessionStorage.getItem("questionType"),
    };
  },
  beforeMount() {
    this.getTF();
    this.getMulti();
    this.getMistake();
    this.getMistakeID();
  },
  methods: {
    getMistake() {
      const storedMistakes = sessionStorage.getItem("mistakes");
      this.mistakes = storedMistakes ? JSON.parse(storedMistakes) : [];
    },
    getMistakeID() {
      const storedID = sessionStorage.getItem("ID");
      this.id = storedID ? JSON.parse(storedID) : 0;
    },
    getTF() {
      return fetch(
        this.questions +
          "&category=" +
          this.gameType +
          "&difficulty=hard&type=boolean"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // Goal 1
          this.response = data;
          // if the response_code is 1, then generate another type question
          if (this.response.response_code !== 1) {
            console.log("True/False choice response: ");
            console.log(this.response);
            this.results = data.results;
            this.level = this.results[0].difficulty;
          } else {
            alert(
              "No enough question in this type, random type question are given; Compensation points of 2 has been given to you"
            );
            // Compensate the player
            let parsedScore = parseInt(this.score, 10);
            parsedScore += 2;
            this.score = parsedScore;
            sessionStorage.setItem("playerScore", this.score);
            return fetch(
              "https://opentdb.com/api.php?amount=1&difficulty=hard&type=boolean"
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                // Goal 1
                this.response = data;
                console.log("True/False choice response: ");
                console.log(this.response);
                this.results = data.results;
                this.level = this.results[0].difficulty;
              });
          }
        });
    },
    getMulti() {
      return fetch(
        this.questions +
          "&category=" +
          this.gameType +
          "&difficulty=hard&type=multiple"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.response = data; // goal 1
          console.log("Multiple choice response: ");
          console.log(this.response);
          this.multipleQuestion = data.results;
          const uniqueIndex = commonMethods.getRandomIndex();
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
    switchToMulti() {
      this.isMulti = true;
      this.isTF = false;
    },
    exit() {
      commonMethods.sessionStore("lives", 3);
      window.location.replace("/start");
    },
    // Goal 2 & 3
    checkAnswer() {
      if (this.option === null) {
        this.isCorrect = false;
        this.isNull = true;
      } else if (this.option === this.results[0]["correct_answer"]) {
        let parsedLives = commonMethods.parsedLives(this.lives);
        this.lives = parsedLives;
        let parsedScore = commonMethods.parsedScore(this.score);
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          parsedScore += 6;
        }
        this.score = parsedScore;
        this.isCorrect = true;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
      } else {
        let parsedLives = commonMethods.parsedLives(this.lives);
        parsedLives--;
        this.lives = parsedLives;
        let parsedScore = commonMethods.parsedScore(this.score);
        parsedScore -= 3;
        this.score = parsedScore;
        this.isCorrect = false;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
        commonMethods.sessionStore("lives", this.lives);
        if (this.lives === 0) {
          this.ifLoose = true;
          this.isLastLife = true;
        }
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          let parsedID = parseInt(this.id, 10);
          parsedID++;
          const mistake = {
            mistakeID: parsedID,
            question_name: this.results[0]["question"],
            question_type: this.results[0]["type"],
            difficulty: this.results[0]["difficulty"],
            player_answer: this.option,
            correct_ans: this.results[0]["correct_answer"],
          };
          this.mistakes.push(mistake);
          this.id = parsedID;
          commonMethods.sessionStore("mistakes", JSON.stringify(this.mistakes));
          commonMethods.sessionStore("ID", this.id);
        }
        this.incorrectAnswers.push(this.results[0]["question"]);
      }
    },
    // Goal 4 & 5
    checkAnswer2() {
      if (this.multiOp === null || this.multiOp === undefined) {
        this.isCorrect = false;
        this.isNull = true;
      } else if (this.multiOp === this.multipleQuestion[0]["correct_answer"]) {
        let parsedLives = commonMethods.parsedLives(this.lives);
        this.lives = parsedLives;
        let parsedScore = commonMethods.parsedScore(this.score);
        if (
          !this.incorrectMulti.includes(this.multipleQuestion[0]["question"])
        ) {
          parsedScore += 6;
        }
        this.score = parsedScore;
        this.isCorrect = true;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
      } else {
        let parsedLives = parseInt(this.lives, 10);
        parsedLives--;
        this.lives = parsedLives;
        let parsedScore = parseInt(this.score, 10);
        parsedScore -= 3;
        this.score = parsedScore;
        this.isCorrect = false;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
        commonMethods.sessionStore("lives", this.lives);
        if (this.lives === 0) {
          this.ifLoose = true;
          this.isLastLife = true;
        }
        if (
          !this.incorrectMulti.includes(this.multipleQuestion[0]["question"])
        ) {
          let parsedID = parseInt(this.id, 10);
          parsedID++;
          const mistake = {
            mistakeID: parsedID,
            question_name: this.multipleQuestion[0]["question"],
            question_type: this.multipleQuestion[0]["type"],
            difficulty: this.multipleQuestion[0]["difficulty"],
            player_answer: this.multiOp,
            correct_ans: this.multipleQuestion[0]["correct_answer"],
          };
          this.mistakes.push(mistake);
          this.id = parsedID;
          commonMethods.sessionStore("mistakes", JSON.stringify(this.mistakes));
          commonMethods.sessionStore("ID", this.id);
        }
        this.incorrectMulti.push(this.multipleQuestion[0]["question"]);
      }
    },
  },
});

app.mount("#app");
