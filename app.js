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
    englishText.textContent = "Failed to load Bible data.";
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
  Object.keys(bible[book]).forEach(chapter => {
    const opt = document.createElement("option");
    opt.value = chapter;
    opt.textContent = chapter;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

// Load verses
function loadVerses() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  verseSelect.innerHTML = "";

  Object.keys(bible[book][chapter]).forEach(verse => {
    const opt = document.createElement("option");
    opt.value = verse;
    opt.textContent = verse;
    verseSelect.appendChild(opt);
  });

  showVerse();
}

// Show verse text
function showVerse() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  const verse = verseSelect.value;

  englishText.textContent = bible[book][chapter][verse];
}

// Events
bookSelect.addEventListener("change", loadChapters);
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);
