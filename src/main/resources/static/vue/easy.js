import { commonMethods } from "/vue/common.js";

const app = Vue.createApp({
  data() {
    return {
      ...commonMethods,
      questions: "https://opentdb.com/api.php?amount=1",
      // the origional data (response_code + results)
      response: null,
      // only TF questions
      results: [],
      // only multi question
      multipleQuestion: [],
      // both true and false answers
      multiQs: [],
      // wrong question collection
      mistakes: [],
      // mistake id (only 2 actually)
      id: 0,
      // incorrect answer to keep track on which questions the user did wrong
      // if wrong, then when the user answer again, neither points will add, nor mistakes array will collect
      incorrectAnswers: [],
      incorrectMulti: [],
      // game's level
      level: null,
      // player's points question worth: easy = 2, medium = 4, hard = 6
      // if their answer is wrong, deduct: easy = 1, medium = 2, hard = 3
      score: 0,
      // if no more lives, is lose
      ifLoose: false,
      // if last life
      isLastLife: false,
      // different question type
      isTF: true,
      isMulti: false,
      // player's choice for TF
      option: null,
      // player's choice for multi
      multiOp: null,
      // if player chosed
      isNull: true,
      // if answer correct
      isCorrect: false,
      // lives, get from current tab
      lives: sessionStorage.getItem("lives"),
      // get type from previous web page
      gameType: sessionStorage.getItem("questionType"),
    };
  },
  beforeMount() {
    // fetch the questions
    this.getTF();
    this.getMulti();
  },
  methods: {
    getTF() {
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
          // Goal1: print the response to the console
          this.response = data;
          console.log("True/False choice response: ");
          console.log(this.response);
          // get the actual question except the response_code
          this.results = data.results;
          this.level = this.results[0].difficulty;
        });
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
          // Goal 1
          this.response = data;
          console.log("Multiple choice response: ");
          console.log(this.response);
          this.multipleQuestion = data.results;
          // get the unique indexes from the array (0 to 3)
          const uniqueIndex = this.getRandomIndex();
          // insert them into the multiple choice question
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
    // hide the T/F question page
    switchToMulti() {
      this.isMulti = true;
      this.isTF = false;
    },
    // exit
    exit() {
      commonMethods.sessionStore("lives", 3);
      window.location.replace("/start");
    },
    // Goal 2 & 3
    checkAnswer() {
      // if player didn't select an answer
      if (this.option === null) {
        this.isCorrect = false;
        this.isNull = true;
        // answer correct
      } else if (this.option === this.results[0]["correct_answer"]) {
        // convert to integer
        let parsedLives = commonMethods.parsedLives(this.lives);
        this.lives = parsedLives;
        let parsedScore = commonMethods.parsedScore(this.score);
        // check if player already answered this question
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          parsedScore += 2;
        }
        // assign the converted data to the score
        this.score = parsedScore;
        this.isCorrect = true;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
      } else {
        // answer incorrect
        let parsedLives = commonMethods.parsedLives(this.lives);
        parsedLives--;
        this.lives = parsedLives;
        let parsedScore = commonMethods.parsedScore(this.score);
        parsedScore--;
        this.score = parsedScore;
        this.isCorrect = false;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
        commonMethods.sessionStore("lives", this.lives);
        // determine if it's the last life player has
        if (this.lives === 0) {
          this.ifLoose = true;
          this.isLastLife = true;
        }
        // collect player's mistake, no redundance
        if (!this.incorrectAnswers.includes(this.results[0]["question"])) {
          // create the mistake object
          const mistake = {
            mistakeID: ++this.id,
            question_name: this.results[0]["question"],
            question_type: this.results[0]["type"],
            difficulty: this.results[0]["difficulty"],
            player_answer: this.option,
            correct_ans: this.results[0]["correct_answer"],
          };
          // store into the mistake array
          this.mistakes.push(mistake);
          // transfer the object to JSON string
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
          parsedScore += 2;
        }
        this.score = parsedScore;
        this.isCorrect = true;
        this.isNull = false;
        commonMethods.sessionStore("playerScore", this.score);
      } else {
        // convert lives to integer
        let parsedLives = commonMethods.parsedLives(this.lives);
        parsedLives--;
        this.lives = parsedLives;
        // convert score to integer
        let parsedScore = commonMethods.parsedScore(this.score);
        parsedScore--;
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
          const mistake = {
            mistakeID: ++this.id,
            question_name: this.multipleQuestion[0]["question"],
            question_type: this.multipleQuestion[0]["type"],
            difficulty: this.multipleQuestion[0]["difficulty"],
            player_answer: this.multiOp,
            correct_ans: this.multipleQuestion[0]["correct_answer"],
          };
          this.mistakes.push(mistake);
          commonMethods.sessionStore("mistakes", JSON.stringify(this.mistakes));
          commonMethods.sessionStore("ID", this.id);
        }
        this.incorrectMulti.push(this.multipleQuestion[0]["question"]);
      }
    },
  },
});

app.mount("#app");
