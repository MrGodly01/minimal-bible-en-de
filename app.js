let bible = {};
let bookSelect = document.getElementById("book");
let chapterSelect = document.getElementById("chapter");
let verseSelect = document.getElementById("verse");

let englishBox = document.getElementById("englishText");
let germanBox = document.getElementById("germanText");

// Load KJV Bible
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data;
    loadBooks();
  });

function loadBooks() {
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(book => {
    let opt = document.createElement("option");
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
  });
  loadChapters();
}

function loadChapters() {
  chapterSelect.innerHTML = "";
  verseSelect.innerHTML = "";
  let book = bookSelect.value;
  Object.keys(bible[book]).forEach(ch => {
    let opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

function loadVerses() {
  verseSelect.innerHTML = "";
  let book = bookSelect.value;
  let chapter = chapterSelect.value;
  Object.keys(bible[book][chapter]).forEach(v => {
    let opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    verseSelect.appendChild(opt);
  });
  showVerse();
}

function showVerse() {
  let book = bookSelect.value;
  let chapter = chapterSelect.value;
  let verse = verseSelect.value;

  let text = bible[book][chapter][verse];
  englishBox.textContent = text;
  germanBox.textContent = "—";
}

bookSelect.addEventListener("change", loadChapters);
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);
