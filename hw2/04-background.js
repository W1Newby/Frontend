let intervalId = null;

const toggle = document.getElementById("toggle");
const intervalInput = document.getElementById("intervalInput");
const body = document.body;

function getRandomColor() {
  // Use hsla for soft random colors
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70;
  const lightness = 70;
  const alpha = 0.8; // softer transparency
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

function startChangingBackground() {
  const intervalSeconds = parseInt(intervalInput.value) || 3;
  changeBackground(); // change immediately
  intervalId = setInterval(changeBackground, intervalSeconds * 1000);
  toggle.textContent = "Stop";
  toggle.classList.remove("btn-primary");
  toggle.classList.add("btn-danger");
}

function stopChangingBackground() {
  clearInterval(intervalId);
  intervalId = null;
  toggle.textContent = "Start";
  toggle.classList.remove("btn-danger");
  toggle.classList.add("btn-primary");
}

function changeBackground() {
  body.style.backgroundColor = getRandomColor();
}

toggle.addEventListener("click", () => {
  if (intervalId) {
    stopChangingBackground();
  } else {
    startChangingBackground();
  }
});
