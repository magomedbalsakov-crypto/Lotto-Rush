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
const ageModal = document.getElementById("ageModal");
const enterSiteBtn = document.getElementById("enterSiteBtn");
const toast = document.getElementById("toast");
const openPreviewBtn = document.getElementById("openPreviewBtn");
const closePreviewBtn = document.getElementById("closePreviewBtn");
const ticketPreviewModal = document.getElementById("ticketPreviewModal");

let selectedMain = [];
let selectedBonus = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function createNumberButtons() {
  for (let i = 1; i <= 40; i++) {
    const button = document.createElement("button");
    button.className = "number-btn";
    button.textContent = i;
    button.addEventListener("click", () => toggleMainNumber(i));
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
    ball.textContent = String(num).padStart(2, "0");
    heroMiniGrid.appendChild(ball);
  });
}

function toggleMainNumber(number) {
  const isSelected = selectedMain.includes(number);

  if (isSelected) {
    selectedMain = selectedMain.filter((item) => item !== number);
    showToast(`Removed ${number}`);
  } else {
    if (selectedMain.length >= 5) {
      showToast("Only 5 main numbers allowed.");
      return;
    }

    selectedMain.push(number);
    showToast(`Added ${number}`);
  }

  selectedMain.sort((a, b) => a - b);
  updateUI();
}

function selectBonusNumber(number) {
  selectedBonus = selectedBonus === number ? null : number;
  showToast(selectedBonus ? `Rush Bonus set to ${number}` : "Rush Bonus cleared.");
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
    selectedMain.length > 0 ? selectedMain.map(n => String(n).padStart(2, "0")).join(", ") : "None selected";

  selectedBonusEl.textContent =
    selectedBonus !== null ? String(selectedBonus).padStart(2, "0") : "None selected";

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
  showToast("Quick Pick ticket generated.");
}

function clearTicket() {
  selectedMain = [];
  selectedBonus = null;
  winningNumbersEl.textContent = "Not drawn yet";
  winningBonusEl.textContent = "Not drawn yet";
  matchResultEl.textContent = "Pick numbers first";
  updateUI();
  showToast("Ticket cleared.");
}

function generateDemoDraw() {
  if (selectedMain.length !== 5 || selectedBonus === null) {
    showToast("Pick 5 numbers and 1 Rush Bonus first.");
    return;
  }

  const winningMain = getRandomUniqueNumbers(40, 5);
  const winningBonus = getRandomUniqueNumbers(20, 1)[0];

  const mainMatches = selectedMain.filter((number) =>
    winningMain.includes(number)
  ).length;

  const bonusMatch = selectedBonus === winningBonus;

  winningNumbersEl.textContent = winningMain.map(n => String(n).padStart(2, "0")).join(", ");
  winningBonusEl.textContent = String(winningBonus).padStart(2, "0");
  matchResultEl.textContent = getPrizeMessage(mainMatches, bonusMatch);

  showToast("Demo draw complete.");
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
    showToast("Complete your ticket first.");
    return;
  }

  showToast("Demo checkout opened.");

  setTimeout(() => {
    alert(
      "Demo checkout only. Real lottery payments require licensing, age verification, legal approval, and a secure backend."
    );
  }, 350);
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

function setupFAQ() {
  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.classList.toggle("active");
    });
  });
}

enterSiteBtn.addEventListener("click", () => {
  ageModal.classList.add("hidden");
  showToast("Welcome to Lotto Rush.");
});

openPreviewBtn.addEventListener("click", () => {
  ticketPreviewModal.classList.add("show");
});

closePreviewBtn.addEventListener("click", () => {
  ticketPreviewModal.classList.remove("show");
});

ticketPreviewModal.addEventListener("click", (event) => {
  if (event.target === ticketPreviewModal) {
    ticketPreviewModal.classList.remove("show");
  }
});

quickPickBtn.addEventListener("click", quickPick);
clearBtn.addEventListener("click", clearTicket);
demoBuyBtn.addEventListener("click", demoCheckout);
generateDrawBtn.addEventListener("click", generateDemoDraw);

createNumberButtons();
createHeroMiniGrid();
setupFAQ();
updateUI();
updateCountdown();
setInterval(updateCountdown, 1000);
