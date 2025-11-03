
// grabbing stuff from the html page
const input = document.getElementById("userInput");
const textContainer = document.getElementById("textContainer");
//const countOutput = document.getElementById("countOutput");

// keep the original text safe so we can reset it later
const originalText = textContainer.innerHTML;

// run the count when user presses enter
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    doCount();
  }
});

// the main function
function doCount() {
  let word = input.value.trim();
  if (word === "") {
    textContainer.innerHTML = originalText;
    return;
  }

  // make regex to match word (case insensitive)
  let regex = new RegExp(`(${word})`, "gi");

  // get all matches in the text
  let matches = originalText.match(regex);
  let count = matches ? matches.length : 0;

  // replace all with highlighted span
  let newText = originalText.replace(
    regex,
    `<span class="highlight">$1</span>`
  );
  textContainer.innerHTML = newText;
}
