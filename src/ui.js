/**
 * HUD & toast notification system.
 */

const TOAST_MESSAGES = [
  "Emma giggles", "Ollie's tail is wagging!", "So pretty!",
  "A flower for Emma!", "Happy puppy!", "What a good boy!",
  "Emma claps!", "Sniff sniff... found one!", "Meadow magic",
  "Ollie prances happily!", "Emma squeals with delight!", "Flower friends!",
];

export function randomToastMessage() {
  return TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
}

export function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2700);
}

export function updateFlowerCount(count) {
  document.getElementById('flower-count').textContent = count;
}

export function updateJoyBar(level) {
  document.getElementById('joy-fill').style.width = (level * 100) + '%';
}
