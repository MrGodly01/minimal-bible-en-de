const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const enText = document.getElementById("en");

let bible = {};

// Load the full English Bible
fetch("data/kjv.json")
  .then(response => response.json())
  .then(data => {
    bible = data;
    loadBooks();
  });

function loadBooks() {
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(book => {
    const option = document.createElement("option");
    option.value = book;
    option.textContent = book;
    bookSelect.appendChild(option);
  });
  loadChapters();
}

function loadChapters() {
  const book = bookSelect.value;
  chapterSelect.innerHTML = "";
  Object.keys(bible[book]).forEach(chapter => {
    const option = document.createElement("option");
    option.value = chapter;
    option.textContent = chapter;
    chapterSelect.appendChild(option);
  });
  loadVerses();
}

function loadVerses() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  verseSelect.innerHTML = "";
  Object.keys(bible[book][chapter]).forEach(verse => {
    const option = document.createElement("option");
    option.value = verse;
    option.textContent = verse;
    verseSelect.appendChild(option);
  });
  showVerse();
}

function showVerse() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  const verse = verseSelect.value;
  enText.textContent = bible[book][chapter][verse];
}

bookSelect.addEventListener("change", loadChapters);
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);
