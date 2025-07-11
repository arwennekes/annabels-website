// Minimal Estimator Frontend (anonymous, no names, no logins)
const POKER_VALUES = [1, 2, 3, 5, 8, 13, 21, '?'];
const NUM_PARTICIPANTS = 5; // 1 user + 4 simulated

function getRandomEmoji() {
  const emojis = ['😀', '😎', '🤓', '🦄', '🐱', '🐶', '🐸', '🐼'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function createParticipants() {
  return Array(NUM_PARTICIPANTS).fill(null).map((_, i) => ({
    id: i,
    emoji: getRandomEmoji(),
    selection: undefined,
    isUser: i === 0,
  }));
}

let participants = createParticipants();
let userSelection = undefined;
let countdown = 5;
let countdownInterval = null;

const cardsDiv = document.getElementById('cards');
const startBtn = document.getElementById('start-btn');
const countdownDiv = document.getElementById('countdown');
const resultsDiv = document.getElementById('results');

function renderCards() {
  cardsDiv.innerHTML = '';
  POKER_VALUES.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'card-btn' + (userSelection === val ? ' selected' : '');
    btn.textContent = val;
    btn.onclick = () => {
      userSelection = val;
      participants[0].selection = val;
      renderCards();
    };
    cardsDiv.appendChild(btn);
  });
}

function renderCountdown() {
  countdownDiv.textContent = `Revealing in ${countdown}...`;
  countdownDiv.classList.remove('hidden');
}

function renderResults() {
  resultsDiv.innerHTML = '<b>Results:</b><br>' +
    participants.map(p => `${p.emoji}: <b>${p.selection ?? '-'}</b>`).join('<br>');
  resultsDiv.classList.remove('hidden');
}

function reset() {
  participants = createParticipants();
  userSelection = undefined;
  countdown = 5;
  clearInterval(countdownInterval);
  renderCards();
  countdownDiv.classList.add('hidden');
  resultsDiv.classList.add('hidden');
  startBtn.disabled = false;
}

startBtn.onclick = () => {
  if (!userSelection) {
    alert('Please select a card first!');
    return;
  }
  startBtn.disabled = true;
  countdown = 5;
  renderCountdown();
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      renderCountdown();
    } else {
      clearInterval(countdownInterval);
      // Simulate other participants
      for (let i = 1; i < participants.length; i++) {
        participants[i].selection = POKER_VALUES[Math.floor(Math.random() * POKER_VALUES.length)];
        participants[i].emoji = getRandomEmoji();
      }
      countdownDiv.classList.add('hidden');
      renderResults();
      setTimeout(reset, 4000);
    }
  }, 1000);
};

// Initial render
renderCards(); 