const typingTextElement = document.getElementById("typing-text");
const timerElement = document.getElementById("timer");
const typingInputBoxElement = document.getElementById("typing-input-box");
const statusSectionElement = document.getElementById("status-section");
const nextButtonElement = document.getElementById("next-btn");
const restartButtonElement = document.getElementById("restart-btn");

const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");

let intervalId;

function startTimer() {
  intervalId ??= setInterval(timer, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function timer() {
  let updatedTime = Number(timerElement.innerText) - 1;
  if (updatedTime < 0) {
    stopTimer();
  } else {
    timerElement.innerText = updatedTime;
  }
}

async function getRandomTextPassage() {
  const file = await fetch("./stories.json");
  const json = await file.json();
  const stories = json.stories;
  const story = stories[Math.floor(Math.random() * stories.length)];

  return "children are here"; //(story && story.text) || "";
}

function getApproximateTimeToFinishTheSentence(passage) {
  const timeForEachLetter = 0.2; //0.2 seconds
  return Math.floor(passage.length * timeForEachLetter);
}

async function fetchData() {
  const passage = await getRandomTextPassage();
  typingTextElement.innerText = passage;
  const time = getApproximateTimeToFinishTheSentence(passage);
  timerElement.innerText = time;
}

function isSentenceCompleted() {
  const inputBoxValue = typingInputBoxElement.value;
  const sentence = typingTextElement.innerText;
  return inputBoxValue.length >= sentence.length ? true : false;
}

function showStats(status) {
  statusSectionElement.style.display = "flex";
  accuracyElement.innerText = status.accuracy + "%";
  wpmElement.innerText = status.wpm;
}

function findStatus() {
  const time = Number(timerElement.innerText);
  const inputBoxValue = typingInputBoxElement.value;
  const sentence = typingTextElement.innerText;

  const inputValueSplitted = inputBoxValue.split("");
  const sentenceSplitted = sentence.split("");

  const totalCharactersTyped = inputValueSplitted.length;

  let correctCharacters = 0;
  let wrongCharacters = 0;

  for (let idx = 0; idx <= sentenceSplitted.length; idx++) {
    if (inputValueSplitted[idx] === sentenceSplitted[idx]) {
      correctCharacters += 1;
    } else {
      wrongCharacters += 1;
    }
  }

  const wpm = correctCharacters / (5 * time);
  const accuracy =
    correctCharacters > 0
      ? (correctCharacters / totalCharactersTyped) * 100
      : 0;

  const status = { wpm, accuracy };

  return status;
}

typingInputBoxElement.addEventListener("input", () => {
  const isCompleted = isSentenceCompleted();
  const counterTime = Number(timerElement.innerText);
  if (isCompleted || counterTime <= 0) {
    const status = findStatus();
    showStats(status);
    typingInputBoxElement.disabled = true;
    nextButtonElement.style.display = "block";
  }

  startTimer();
});

fetchData();
