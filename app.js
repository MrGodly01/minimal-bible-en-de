const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");
const palette = document.getElementById("highlightPalette");
const clearHighlightBtn = document.getElementById("clearHighlight");

let activeVerseEl = null;
let activeVerseId = null;

let bible = {};
let currentBook = "";
let currentChapter = 1;

// LOAD HIGHLIGHTS
let highlights = JSON.parse(localStorage.getItem("highlights")) || {};
let highlightHistory = JSON.parse(localStorage.getItem("highlightHistory")) || [];

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
    div.onclick = () => {
  activeVerseEl = div;
  activeVerseId = verseId;
  palette.classList.remove("hidden");
};

    versesEl.appendChild(div);
  });
}

// SINGLE TAP HIGHLIGHT
function toggleHighlight(el, id) {
  const colors = ["highlight-yellow", "highlight-green", "highlight-blue"];
  const current = highlights[id];
  const next = colors[(colors.indexOf(current) + 1) % colors.length];

  // remove old colors
  el.classList.remove(...colors);

  // apply new color
  el.classList.add(next);

  // save highlight
  highlights[id] = next;
  highlightHistory.push(id);

  localStorage.setItem("highlights", JSON.stringify(highlights));
  localStorage.setItem("highlightHistory", JSON.stringify(highlightHistory));
}
function undoHighlight() {
  const lastId = highlightHistory.pop();
  if (!lastId) return;

  delete highlights[lastId];

  document.querySelectorAll(".verse").forEach(v => {
    if (v.dataset.id === lastId) {
      v.classList.remove(
        "highlight-yellow",
        "highlight-green",
        "highlight-blue"
      );
    }
  });

  localStorage.setItem("highlights", JSON.stringify(highlights));
  localStorage.setItem("highlightHistory", JSON.stringify(highlightHistory));
}
function clearAllHighlights() {
  highlights = {};
  highlightHistory = [];

  document.querySelectorAll(".verse").forEach(v => {
    v.classList.remove(
      "highlight-yellow",
      "highlight-green",
      "highlight-blue"
    );
  });

  localStorage.removeItem("highlights");
  localStorage.removeItem("highlightHistory");
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
document.querySelectorAll(".palette-colors span").forEach(dot => {
  dot.onclick = () => {
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
  };
});
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
document.addEventListener("click", (e) => {
  if (!palette.contains(e.target) && !e.target.classList.contains("verse")) {
    palette.classList.add("hidden");
  }
});
