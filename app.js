const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const englishText = document.getElementById("englishText");
const germanText = document.getElementById("germanText");

let bible = {};

async function loadBible() {
  const res = await fetch("data/kjv.json");
  bible = await res.json();

  // Load books
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(book => {
    const opt = document.createElement("option");
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
  });

  loadChapters();
}

function loadChapters() {
  chapterSelect.innerHTML = "";
  const book = bookSelect.value;

  Object.keys(bible[book]).forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });

  load
