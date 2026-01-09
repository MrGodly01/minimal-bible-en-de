const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");

const enText = document.getElementById("en");
const deText = document.getElementById("de");

let bible = {};

async function loadBook(book) {
  const res = await fetch(`data/${book}.json`);
  bible = await res.json();
  populateChapters();
}

function populateBooks() {
  bookSelect.innerHTML = `<option value="John">John</option>`;
  loadBook("John");
}

function populateChapters() {
  chapterSelect.innerHTML = "";
  Object.keys(bible).forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
  populateVerses();
}

function populateVerses() {
  verseSelect.innerHTML = "";
  const chapter = chapterSelect.value;
  Object.keys(bible[chapter]).forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    verseSelect.appendChild(opt);
  });
  showVerse();
}

function showVerse() {
  const c = chapterSelect.value;
  const v = verseSelect.value;
  enText.textContent = bible[c][v].en;
  deText.textContent = bible[c][v].de;
}

bookSelect.onchange = () => loadBook(bookSelect.value);
chapterSelect.onchange = populateVerses;
verseSelect.onchange = showVerse;

populateBooks();
