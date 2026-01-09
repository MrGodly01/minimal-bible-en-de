const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");

let bible = {};
let currentBook = "";
let currentChapter = "";

// =====================
// THEME TOGGLE
// =====================
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};

// =====================
// HIGHLIGHT STORAGE
// =====================
let highlights = JSON.parse(localStorage.getItem("highlights")) || {};

function saveHighlights() {
  localStorage.setItem("highlights", JSON.stringify(highlights));
}

// =====================
// LOAD BIBLE
// =====================
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books.reduce((acc, b) => {
      acc[b.name] = b.chapters;
      return acc;
    }, {});
    loadBooks();
  });

// =====================
// LOAD BOOKS
// =====================
function loadBooks() {
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(book => {
    bookSelect.innerHTML += `<option>${book}</option>`;
  });
  currentBook = bookSelect.value;
  loadChapters();
}

// =====================
// LOAD CHAPTERS
// =====================
function loadChapters() {
  chapterSelect.innerHTML = "";
  bible[currentBook].forEach(ch => {
    chapterSelect.innerHTML += `<option>${ch.chapter}</option>`;
  });
  currentChapter = chapterSelect.value;
  loadVerses();
}

// =====================
// LOAD VERSES
// =====================
function loadVerses() {
  versesEl.innerHTML = "";
  const chapter = bible[currentBook].find(c => c.chapter == currentChapter);

  chapter.verses.forEach(v => {
    const verseId = `${currentBook}-${currentChapter}-${v.verse}`;

    const div = document.createElement("div");
    div.className = "verse";
    div.dataset.id = verseId;

    // Apply highlight if exists
    if (highlights[verseId]) {
      div.classList.add(highlights[verseId]);
    }

    div.innerHTML = `
      <span class="verse-num">${v.verse}</span>
      ${v.text}
    `;

    // CLICK TO TOGGLE HIGHLIGHT
    div.onclick = () => toggleHighlight(div, verseId);

    versesEl.appendChild(div);
  });
}

// =====================
// TOGGLE HIGHLIGHT
// =====================
function toggleHighlight(el, id) {
  const colors = [
    "highlight-yellow",
    "highlight-blue",
    "highlight-green",
    "highlight-pink"
  ];

  // If already highlighted → remove
  if (highlights[id]) {
    el.classList.remove(highlights[id]);
    delete highlights[id];
  } else {
    // Default highlight (yellow)
    el.classList.add("highlight-yellow");
    highlights[id] = "highlight-yellow";
  }

  saveHighlights();
}

// =====================
// EVENTS
// =====================
bookSelect.onchange = () => {
  currentBook = bookSelect.value;
  loadChapters();
};

chapterSelect.onchange = () => {
  currentChapter = chapterSelect.value;
  loadVerses();
};
// Bottom navigation logic
const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach(btn => {
  btn.addEventListener("click", () => {
    // Active tab
    navItems.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Switch screen
    const target = btn.dataset.target;
    screens.forEach(screen => {
      screen.classList.remove("active");
      if (screen.id === "screen-" + target) {
        screen.classList.add("active");
      }
    });
  });
});
// THEME TOGGLE
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  toggle.textContent =
    document.body.classList.contains("light") ? "🌞" : "🌙";
});

// BOTTOM NAV
const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach(btn => {
  btn.addEventListener("click", () => {
    navItems.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(screen => screen.classList.remove("active"));
    document
      .getElementById("screen-" + btn.dataset.target)
      .classList.add("active");
  });
});
