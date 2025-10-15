//const elem = document.querySelector('input');

//elem.addEventListener('input', handleInput);

const input = document.getElementById("number-input");
const result = document.getElementById("result");

input.addEventListener("input", () => {
  result.textContent = `You typed: ${input.value}`;
});

console.log("JS file loaded ✅");
