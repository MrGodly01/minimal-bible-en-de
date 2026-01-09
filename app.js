const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");

let bible = {};
let currentBook = "";
let currentChapter = 1;

// LOAD HIGHLIGHTS
let highlights = JSON.parse(localStorage.getItem("highlights")) || {};

// LOAD BIBLE
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books;
    loadBooks();
  });

// LOAD BOOKS
function loadBooks() {
  bookSelect.innerHTML = "";
  bible.forEach(book => {
    const opt = document.createElement("option");
    opt.value = book.name;
    opt.textContent = book.name;
    bookSelect.appendChild(opt);
  });
  currentBook = bookSelect.value;
  loadChapters();
}

// LOAD CHAPTERS
function loadChapters() {
  chapterSelect.innerHTML = "";
  const book = bible.find(b => b.name === currentBook);
  book.chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch.chapter;
    opt.textContent = ch.chapter;
    chapterSelect.appendChild(opt);
  });
  currentChapter = chapterSelect.value;
  loadVerses();
}

// LOAD VERSES
function loadVerses() {
  versesEl.innerHTML = "";
  const book = bible.find(b => b.name === currentBook);
  const chapter = book.chapters.find(c => c.chapter == currentChapter);

  chapter.verses.forEach(v => {
    const id = `${book.name}-${chapter.chapter}-${v.verse}`;
    const div = document.createElement("div");
    div.className = "verse";
    div.dataset.id = id;

    if (highlights[id]) {
      div.classList.add(highlights[id]);
    }

    div.innerHTML = `<span class="verse-num">${v.verse}</span> ${v.text}`;
    div.onclick = () => toggleHighlight(div, id);

    versesEl.appendChild(div);
  });
}

// SINGLE TAP HIGHLIGHT
function toggleHighlight(el, id) {
  const colors = ["highlight-yellow", "highlight-blue", "highlight-green"];
  const current = highlights[id];
  const next = colors[(colors.indexOf(current) + 1) % colors.length];

  el.classList.remove(...colors);
  el.classList.add(next);

  highlights[id] = next;
  localStorage.setItem("highlights", JSON.stringify(highlights));
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

// THEME TOGGLE
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};
