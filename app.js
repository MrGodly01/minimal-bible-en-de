const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const palette = document.getElementById("highlightPalette");
const clearHighlightBtn = document.getElementById("clearHighlight");

let activeVerseEl = null;
let activeVerseId = null;

// load saved highlights
let highlights = JSON.parse(localStorage.getItem("highlights")) || {};
let highlightHistory =
  JSON.parse(localStorage.getItem("highlightHistory")) || [];

let bible = [];

// LOAD BIBLE
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books;
    loadBooks();
  })
  .catch(err => {
    versesEl.innerHTML = "<p style='color:red'>Failed to load Bible</p>";
    console.error(err);
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
  loadChapters();
}

// LOAD CHAPTERS
function loadChapters() {
  chapterSelect.innerHTML = "";
  const book = bible.find(b => b.name === bookSelect.value);

  book.chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch.chapter;
    opt.textContent = ch.chapter;
    chapterSelect.appendChild(opt);
  });

  loadVerses();
}

// LOAD VERSES
function loadVerses() {
  versesEl.innerHTML = "";
  const book = bible.find(b => b.name === bookSelect.value);
  const chapter = book.chapters.find(
    c => c.chapter == chapterSelect.value
  );

  chapter.verses.forEach(v => {
    const div = document.createElement("div");
    div.className = "verse";

    const id = `${book.name}-${chapter.chapter}-${v.verse}`;
    div.dataset.id = id;
    
if (highlights[id]) {
  div.classList.add(highlights[id]);
}

    div.innerHTML = `<span class="verse-num">${v.verse}</span> ${v.text}`;

    div.onclick = (e) => {
      e.stopPropagation();
      activeVerseEl = div;
      activeVerseId = id;
      palette.classList.remove("hidden");
    };

    versesEl.appendChild(div);
  });
}


// EVENTS
bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;
// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
};

// Load saved theme
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀️";
  }
});

// PALETTE COLOR PICK
document.querySelectorAll(".palette-colors span").forEach(dot => {
  dot.onclick = (e) => {
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
highlightHistory.push(activeVerseId);

localStorage.setItem("highlights", JSON.stringify(highlights));
localStorage.setItem(
  "highlightHistory",
  JSON.stringify(highlightHistory)
);

palette.classList.add("hidden");

  };
});

// CLEAR HIGHLIGHT
clearHighlightBtn.onclick = (e) => {
  e.stopPropagation();
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

// CLOSE PALETTE ON OUTSIDE TAP
document.addEventListener("click", (e) => {
  if (!palette.contains(e.target) && !e.target.closest(".verse")) {
    palette.classList.add("hidden");
  }
});

function undoHighlight() {
  const lastId = highlightHistory.pop();
  if (!lastId) return;

  delete highlights[lastId];

  document.querySelectorAll(".verse").forEach(v => {
    if (v.dataset.id === lastId) {
      v.classList.remove(
        "highlight-yellow",
        "highlight-green",
        "highlight-blue",
        "highlight-pink"
      );
    }
  });

  localStorage.setItem("highlights", JSON.stringify(highlights));
  localStorage.setItem(
    "highlightHistory",
    JSON.stringify(highlightHistory)
  );
}
