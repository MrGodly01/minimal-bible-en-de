const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");
const englishText = document.getElementById("englishText");

let bible = null;

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

  bible.books.forEach((book, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = book.name;
    bookSelect.appendChild(opt);
  });

  loadChapters();
}

// Load chapters
function loadChapters() {
  chapterSelect.innerHTML = "";

  const bookIndex = bookSelect.value;
  const chapters = bible.books[bookIndex].chapters;

  chapters.forEach((ch, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = ch.chapter;
    chapterSelect.appendChild(opt);
  });

  loadVerses();
}

// Load verses
function loadVerses() {
  verseSelect.innerHTML = "";

  const bookIndex = bookSelect.value;
  const chapterIndex = chapterSelect.value;
  const verses = bible.books[bookIndex].chapters[chapterIndex].verses;

  verses.forEach((v, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = v.verse;
    verseSelect.appendChild(opt);
  });

  showVerse();
}

// Show verse text
function showVerse() {
  const bookIndex = bookSelect.value;
  const chapterIndex = chapterSelect.value;
  const verseIndex = verseSelect.value;

  const verse =
    bible.books[bookIndex]
      .chapters[chapterIndex]
      .verses[verseIndex];

  englishText.textContent = verse.text;
}

// Events
bookSelect.addEventListener("change", loadChapters);
chapterSelect.addEventListener("change", loadVerses);
verseSelect.addEventListener("change", showVerse);
