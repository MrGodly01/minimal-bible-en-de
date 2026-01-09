const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const englishText = document.getElementById("englishText");

let bibleData = [];

// Load Bible
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bibleData = data.books;
    loadBooks();
  })
  .catch(err => {
    englishText.textContent = "Failed to load Bible";
    console.error(err);
  });

// Load books
function loadBooks() {
  bookSelect.innerHTML = "";
  bibleData.forEach((book, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = book.name;
    bookSelect.appendChild(opt);
  });
  loadChapters();
}

// Load chapters
function loadChapters() {
  const book = bibleData[bookSelect.value];
  chapterSelect.innerHTML = "";
  book.chapters.forEach((ch, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = ch.chapter;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

// Load verses
function loadVerses() {
  const chapter =
    bibleData[bookSelect.value].chapters[chapterSelect.value];
  verseSelect.innerHTML = "";
  chapter.verses.forEach((v, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = v.verse;
    verseSelect.appendChild(opt);
  });
  showVerse();
}

// Show verse
function showVerse() {
  const verse =
    bibleData[bookSelect.value]
      .chapters[chapterSelect.value]
      .verses[verseSelect.value];

  englishText.textContent = verse.text;
}

// Events
bookSelect.addEventListener("change", loadChapters);
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);
