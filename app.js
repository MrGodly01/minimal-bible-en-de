const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const englishText = document.getElementById("englishText");

let bible = {};

// Load KJV Bible
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data;
    loadBooks();
  })
  .catch(err => {
    englishText.textContent = "Failed to load Bible data";
    console.error(err);
  });

// Load books
function loadBooks() {
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(book => {
    const opt = document.createElement("option");
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
  });
  loadChapters();
}

// Load chapters
function loadChapters() {
  const book = bookSelect.value;
  chapterSelect.innerHTML = "";
  Object.keys(bible[book]).forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

// Load verses
function loadVerses() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  verse
