const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");
const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const circularProgress = document.querySelector(".circular-progress");
const progressValue = document.querySelector(".progress-value");
let questions = [],
  time,
  score = 0,
  currentQuestion,
  timer;
let progressStartValue = 0;
let progressEndValue;
let speed = 100;

const startQuiz = () => {
  const num = numQuestions.value;
  const cat = category.value;
  const diff = difficulty.value;
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      currentQuestion = 1;
      showQuestion(questions[0]);
    })
    .catch((error) => {
      alert("Unable to fetch questions. Try again later");
      window.location.reload();
    });
};

const showQuestion = (question) => {
  // console.log(question);
  const questionText = document.querySelector(".question");
  const answerWrapper = document.querySelector(".answer-wrapper");
  const questionNumber = document.querySelector(".number");
  questionText.innerHTML = question.question;
  questionNumber.innerHTML = `
  Question <span class="current">${questions.indexOf(question) + 1}</span
  ><span class="total">/${questions.length}</span>
  `;
  const answers = [...question.incorrect_answers, question.correct_answer];
  answers.sort(() => Math.random() - 0.5);
  answerWrapper.innerHTML = "";
  answers.forEach((answer) => {
    answerWrapper.innerHTML += `
    <div class="answer">
    <span class="text">${answer}</span>
    <span class="checkbox">
      <span class="icon"><i class="ri-check-line"></i></span>
    </span>
  </div>
    `;
  });

  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answerDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });
  time = timePerQuestion.value;
  startTimer(time);
};

const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = value;
};

const startTimer = (time) => {
  // console.log("inside timer");
  timer = setInterval(() => {
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text");
    if (answer.innerHTML === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct");
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll(".answer")
      .forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
        }
      });
  }
  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    console.log(score);
    showScore();
  }
};

const showScore = () => {
  quiz.classList.add("hide");
  endScreen.classList.remove("hide");
  totalScore.innerHTML = questions.length;
  finalScore.innerHTML = score;

  progressEndValue = (score / questions.length) * 100;
  console.log(progressEndValue);
  let cirProgress = setInterval(() => {
    if (progressStartValue >= 0 && progressStartValue !== progressEndValue) {
      progressStartValue++;
      progressValue.textContent = `${progressStartValue}%`;
      circularProgress.style.background = `conic-gradient(#af60e5 ${
        progressStartValue * 3.6
      }deg, #ededed 0deg)`;
    } else if (progressStartValue === progressEndValue) {
      clearInterval(cirProgress);
    }
  }, speed);
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", () => {
  checkAnswer();
});
nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  submitBtn.disabled = true;
  nextBtn.style.display = "none";
});
