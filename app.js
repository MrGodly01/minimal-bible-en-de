const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");

const palette = document.getElementById("highlightPalette");
const clearHighlightBtn = document.getElementById("clearHighlight");

let bible = {};
let currentBook = "";
let currentChapter = 1;

let activeVerseEl = null;
let activeVerseId = null;

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

    if (highlights[id]) div.classList.add(highlights[id]);

    div.innerHTML = `<span class="verse-num">${v.verse}</span>${v.text}`;

    div.addEventListener("click", (e) => {
      e.stopPropagation();
      activeVerseEl = div;
      activeVerseId = id;
      palette.classList.remove("hidden");
    });

    versesEl.appendChild(div);
  });
}

// COLOR PICK
document.querySelectorAll(".palette-colors span").forEach(dot => {
  dot.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!activeVerseEl) return;

    const color = dot.dataset.color;

    activeVerseEl.classList.remove(
      "highlight-yellow",
      "highlight-green",
      "highlight-blue",
      "highlight-pink"
    );

    activeVerseEl.classList.add(color);
    highlights[activeVerseId] = color;

    localStorage.setItem("highlights", JSON.stringify(highlights));
    palette.classList.add("hidden");
  });
});

// CLEAR
clearHighlightBtn.onclick = () => {
  if (!activeVerseEl) return;

  activeVerseEl.classList.remove(
    "highlight-yellow",
    "highlight-green",
    "highlight-blue",
    "highlight-pink"
  );

  delete highlights[activeVerseId];
  localStorage.setItem("highlights", JSON.stringify(highlights));
  palette.classList.add("hidden");
};

// CLOSE PALETTE
document.addEventListener("click", () => {
  palette.classList.add("hidden");
});

// EVENTS
bookSelect.onchange = () => {
  currentBook = bookSelect.value;
  loadChapters();
};

chapterSelect.onchange = () => {
  currentChapter = chapterSelect.value;
  loadVerses();
};

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};
