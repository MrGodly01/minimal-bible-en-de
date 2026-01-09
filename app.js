let currentBookData = {};

const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const enText = document.getElementById("en");
const deText = document.getElementById("de");

/* ===== AVAILABLE BOOKS ===== */
/* Add more later: "Genesis", "Matthew", etc */
const BOOKS = ["John"];

/* ===== INIT ===== */
function init() {
  bookSelect.innerHTML = BOOKS
    .map(b => `<option value="${b}">${b}</option>`)
    .join("");

  loadBook(bookSelect.value);
}

/* ===== LOAD BOOK FILE ===== */
function loadBook(book) {
  fetch(`data/${book}.json`)
    .then(res => res.json())
    .then(data => {
      currentBookData = data;
      loadChapters();
    })
    .catch(err => {
      console.error("Failed to load book:", err);
    });
}

/* ===== LOAD CHAPTERS ===== */
function loadChapters() {
  const chapters = Object.keys(currentBookData);

  chapterSelect.innerHTML = chapters
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");

  loadVerses();
}

/* ===== LOAD VERSES ===== */
function loadVerses() {
  const chapter = chapterSelect.value;
  const verses = Object.keys(currentBookData[chapter]);

  verseSelect.innerHTML = verses
    .map(v => `<option value="${v}">${v}</option>`)
    .join("");

  showVerse();
}

/* ===== SHOW VERSE ===== */
function showVerse() {
  const chapter = chapterSelect.value;
  const verse = verseSelect.value;

  enText.textContent = currentBookData[chapter][verse].en;
  deText.textContent = currentBookData[chapter][verse].de;
}

/* ===== EVENTS ===== */
bookSelect.addEventListener("change", () => loadBook(bookSelect.value));
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);

/* ===== START APP ===== */
init();
