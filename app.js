const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");

let bible = {};
let currentBook = "";
let currentChapter = "";

// THEME
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};

// LOAD BIBLE
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books.reduce((acc, b) => {
      acc[b.name] = b.chapters;
      return acc;
    }, {});
    loadBooks();
  });

// BOOKS
function loadBooks() {
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(book => {
    bookSelect.innerHTML += `<option>${book}</option>`;
  });
  currentBook = bookSelect.value;
  loadChapters();
}

// CHAPTERS
function loadChapters() {
  chapterSelect.innerHTML = "";
  bible[currentBook].forEach(ch => {
    chapterSelect.innerHTML += `<option>${ch.chapter}</option>`;
  });
  currentChapter = chapterSelect.value;
  loadVerses();
}

// VERSES
function loadVerses() {
  versesEl.innerHTML = "";
  const chapter = bible[currentBook].find(c => c.chapter == currentChapter);
  chapter.verses.forEach(v => {
    const div = document.createElement("div");
    div.className = "verse";
    div.innerHTML = `<span class="verse-num">${v.verse}</span>${v.text}`;
    versesEl.appendChild(div);
  });
}

// EVENTS
bookSelect.onchange = () => {
  currentBook = bookSelect.value;
  loadChapters();
};

chapterSelect.onchange = () => {
  currentChapter = chapterSelect.value;
  loadVerses();
};
