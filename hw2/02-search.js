//userInput.addEventListener('click', handleClick);
//pulls from html page
const input = document.getElementById("userInput");
const button = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

//runs search when button clicked OR enter button is pressed
button.addEventListener("click", searchCharacters);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCharacters();
});

//search function:
function searchCharacters() {
  const query = input.value.trim().toLowerCase();
  resultsDiv.innerHTML = "";

  //blank or no entered text.
  if (!query) {
    resultsDiv.innerHTML = `<p class="text-danger">Please enter a search term.</p>`;
    return;
  }

  //filter characters from data file
  const matches = characters.filter((char) =>
    char.name.toLowerCase().includes(query)
  );

  //when there is no match:
  if (matches.length === 0) {
    resultsDiv.innerHTML = `<p class="text-muted">No results found.</p>`;
    return;
  }

  //display results for matches:
  matches.forEach((char) => {
    const highlightedName = highlightText(char.name, query);

    // creates a card for each result.
    const card = document.createElement("div");
    card.className = "card p-3 text-center";
    card.style.width = "200px";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${highlightedName}</h5>
        <p class="card-text">Birth year: ${char.birth_year}</p>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}
//function that highlights the search term-yellow
function highlightText(text, term) {
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, `<span class="highlight">$1</span>`);
}
