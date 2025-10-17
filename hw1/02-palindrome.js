//const elem = document.querySelector('input');

//elem.addEventListener('input', handleInput);

const input = document.getElementById("number-input");
const result = document.getElementById("result");

input.addEventListener("input", () => {
  const original = input.value;

  const value_array = original.split("");
  const reverse_array = value_array.reverse();
  const final_value = reverse_array.join("");

  if (original === final_value) {
    result.textContent = `Yes. This is a palindrome!`;
    result.className = "text-success";
  } else {
    result.textContent = `No. Try again.`;
    result.className = "text-danger";
  }
});
