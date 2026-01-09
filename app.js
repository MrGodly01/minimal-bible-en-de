const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const enBox = document.getElementById("englishText");
const deBox = document.getElementById("germanText");

// Only John for now
const BOOKS = ["John"];

BOOKS.forEach(book => {
  const opt = document.createElement("option");
  opt.value = book;
  opt.textContent = book;
  bookSelect.appendChild(opt);
});

bookSelect.addEventListener("change", loadBook);
chapterSelect.addEventListener("change", loadChapter);
verseSelect.addEventListener("change", loadVerse);

let bibleData = {};

async function loadBook() {
  const book = bookSelect.value;
  const res = await fetch(`data/${book}.json`);
  bibleData = await res.json();

  chapterSelect.innerHTML = "";
  verseSelect.innerHTML = "";
  enBox.textContent = "";
  deBox.textContent = "";

  Object.keys(bibleData).forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
}

function loadChapter() {
  const ch = chapterSelect.value;
  verseSelect.innerHTML = "";
  enBox.textContent = "";
  deBox.textContent = "";

  Object.keys(bibleData[ch]).forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    verseSelect.appendChild(opt);
  });
}

function loadVerse() {
  const ch = chapterSelect.value;
  const v = verseSelect.value;

  enBox.textContent = bibleData[ch][v].en;
  deBox.textContent = bibleData[ch][v].de;
}
