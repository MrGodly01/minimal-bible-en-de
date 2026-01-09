let bible;

fetch("bible.json")
  .then(response => response.json())
  .then(data => {
    bible = data;
    loadBooks();
  });

const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const enText = document.getElementById("en");
const deText = document.getElementById("de");

function loadBooks() {
  bookSelect.innerHTML = Object.keys(bible)
    .map(book => `<option value="${book}">${book}</option>`)
    .join("");
  loadChapters();
}

function loadChapters() {
  const book = bookSelect.value;
  chapterSelect.innerHTML = Object.keys(bible[book])
    .map(ch => `<option value="${ch}">${ch}</option>`)
    .join("");
  loadVerses();
}

function loadVerses() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  verseSelect.innerHTML = Object.keys(bible[book][chapter])
    .map(v => `<option value="${v}">${v}</option>`)
    .join("");
  showVerse();
}

function showVerse() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  const verse = verseSelect.value;
  enText.textContent = bible[book][chapter][verse].en;
  deText.textContent = bible[book][chapter][verse].de;
}

bookSelect.addEventListener("change", loadChapters);
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);
