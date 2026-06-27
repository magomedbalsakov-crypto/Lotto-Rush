const mainNumbersEl = document.getElementById("mainNumbers");
const bonusNumbersEl = document.getElementById("bonusNumbers");
const selectedMainEl = document.getElementById("selectedMain");
const selectedBonusEl = document.getElementById("selectedBonus");
const mainCounterEl = document.getElementById("mainCounter");
const bonusCounterEl = document.getElementById("bonusCounter");
const quickPickBtn = document.getElementById("quickPickBtn");
const clearBtn = document.getElementById("clearBtn");
const demoBuyBtn = document.getElementById("demoBuyBtn");
const generateDrawBtn = document.getElementById("generateDrawBtn");
const winningNumbersEl = document.getElementById("winningNumbers");
const winningBonusEl = document.getElementById("winningBonus");
const matchResultEl = document.getElementById("matchResult");
const countdownEl = document.getElementById("countdown");
const heroMiniGrid = document.getElementById("heroMiniGrid");

let selectedMain = [];
let selectedBonus = null;

function createNumberButtons() {
  for (let i = 1; i <= 40; i++) {
    const button = document.createElement("button");
    button.className = "number-btn";
    button.textContent = i;
    button.addEventListener("click", () => toggleMainNumber(i, button));
    mainNumbersEl.appendChild(button);
  }

  for (let i = 1; i <= 20; i++) {
    const button = document.createElement("button");
    button.className = "number-btn";
    button.textContent = i;
    button.addEventListener("click", () => selectBonusNumber(i));
    bonusNumbersEl.appendChild(button);
  }
}

function createHeroMiniGrid() {
  const demoNumbers = [7, 12, 19, 28, 34];

  demoNumbers.forEach((num) => {
    const ball = document.createElement("span");
    ball.textContent = num;
    heroMiniGrid.appendChild(ball);
  });
}

function toggleMainNumber(number) {
  const isSelected = selectedMain.includes(number);

  if (isSelected) {
    selectedMain = selectedMain.filter((item) => item !== number);
  } else {
    if (selectedMain.length >= 5) {
      alert("You can only pick 5 main numbers.");
      return;
    }

    selectedMain.push(number);
  }

  selectedMain.sort((a, b) => a - b);
  updateUI();
}

function selectBonusNumber(number) {
  selectedBonus = selectedBonus === number ? null : number;
  updateUI();
}

function updateUI() {
  document.querySelectorAll("#mainNumbers .number-btn").forEach((button) => {
    const number = Number(button.textContent);
    button.classList.toggle("selected", selectedMain.includes(number));
  });

  document.querySelectorAll("#bonusNumbers .number-btn").forEach((button) => {
    const number = Number(button.textContent);
    button.classList.toggle("selected", selectedBonus === number);
  });

  selectedMainEl.textContent =
    selectedMain.length > 0 ? selectedMain.join(", ") : "None selected";

  selectedBonusEl.textContent =
    selectedBonus !== null ? selectedBonus : "None selected";

  mainCounterEl.textContent = `${selectedMain.length} / 5 selected`;
  bonusCounterEl.textContent = `${selectedBonus === null ? 0 : 1} / 1 selected`;
}

function getRandomUniqueNumbers(max, count) {
  const numbers = [];

  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * max) + 1;

    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers.sort((a, b) => a - b);
}

function quickPick() {
  selectedMain = getRandomUniqueNumbers(40, 5);
  selectedBonus = getRandomUniqueNumbers(20, 1)[0];
  updateUI();
}

function clearTicket() {
  selectedMain = [];
  selectedBonus = null;
  winningNumbersEl.textContent = "Not drawn yet";
  winningBonusEl.textContent = "Not drawn yet";
  matchResultEl.textContent = "Pick numbers first";
  updateUI();
}

function generateDemoDraw() {
  if (selectedMain.length !== 5 || selectedBonus === null) {
    alert("Pick 5 main numbers and 1 Rush Bonus number first.");
    return;
  }

  const winningMain = getRandomUniqueNumbers(40, 5);
  const winningBonus = getRandomUniqueNumbers(20, 1)[0];

  const mainMatches = selectedMain.filter((number) =>
    winningMain.includes(number)
  ).length;

  const bonusMatch = selectedBonus === winningBonus;

  winningNumbersEl.textContent = winningMain.join(", ");
  winningBonusEl.textContent = winningBonus;

  matchResultEl.textContent = getPrizeMessage(mainMatches, bonusMatch);
}

function getPrizeMessage(mainMatches, bonusMatch) {
  if (mainMatches === 5 && bonusMatch) return "Grand Prize Demo Match";
  if (mainMatches === 5) return "Major Prize Demo Match";
  if (mainMatches === 4 && bonusMatch) return "High Tier Demo Match";
  if (mainMatches === 4) return "Medium Tier Demo Match";
  if (mainMatches === 3) return "Small Demo Win";
  if (bonusMatch) return "Rush Bonus Demo Reward";
  return "No demo prize this time";
}

function demoCheckout() {
  if (selectedMain.length !== 5 || selectedBonus === null) {
    alert("Pick 5 main numbers and 1 Rush Bonus number before checkout.");
    return;
  }

  alert(
    "Demo checkout only. Real Stripe payments for lottery tickets need licensing, age verification, a secure backend, and legal approval."
  );
}

function getNextDrawDate() {
  const now = new Date();
  const drawDays = [2, 5]; 
  const drawHour = 21;

  let nextDraw = null;

  for (let i = 0; i < 14; i++) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + i);
    candidate.setHours(drawHour, 0, 0, 0);

    if (drawDays.includes(candidate.getDay()) && candidate > now) {
      nextDraw = candidate;
      break;
    }
  }

  return nextDraw;
}

function updateCountdown() {
  const nextDraw = getNextDrawDate();
  const now = new Date();
  const difference = nextDraw - now;

  const seconds = Math.floor(difference / 1000) % 60;
  const minutes = Math.floor(difference / 1000 / 60) % 60;
  const hours = Math.floor(difference / 1000 / 60 / 60) % 24;
  const days = Math.floor(difference / 1000 / 60 / 60 / 24);

  const values = [days, hours, minutes, seconds];

  countdownEl.querySelectorAll("strong").forEach((item, index) => {
    item.textContent = String(values[index]).padStart(2, "0");
  });
}

quickPickBtn.addEventListener("click", quickPick);
clearBtn.addEventListener("click", clearTicket);
demoBuyBtn.addEventListener("click", demoCheckout);
generateDrawBtn.addEventListener("click", generateDemoDraw);

createNumberButtons();
createHeroMiniGrid();
updateUI();
updateCountdown();
setInterval(updateCountdown, 1000);
