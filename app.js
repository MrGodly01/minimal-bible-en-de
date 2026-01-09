const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");
const openSearchBtn = document.getElementById("openSearch");

const palette = document.getElementById("highlightPalette");
const clearHighlightBtn = document.getElementById("clearHighlight");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchScreen = document.getElementById("searchScreen");

// STATE
let bible = {};
let currentBook = "";
let currentChapter = 1;

let activeVerseEl = null;
let activeVerseId = null;

// LOAD SAVED HIGHLIGHTS
let highlights = JSON.parse(localStorage.getItem("highlights")) || {};

// =======================
// LOAD BIBLE
// =======================
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books;
    loadBooks();
  })
  .catch(err => {
    versesEl.innerText = "Failed to load Bible";
    console.error(err);
  });

// =======================
// LOAD BOOKS
// =======================
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

// =======================
// LOAD CHAPTERS
// =======================
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

// =======================
// LOAD VERSES
// =======================
function loadVerses() {
  versesEl.innerHTML = "";

  const book = bible.find(b => b.name === currentBook);
  const chapter = book.chapters.find(c => c.chapter == currentChapter);

  chapter.verses.forEach(v => {
    const verseId = `${book.name}-${chapter.chapter}-${v.verse}`;

    const div = document.createElement("div");
    div.className = "verse";
    div.dataset.id = verseId;

    if (highlights[verseId]) {
      div.classList.add(highlights[verseId]);
    }

    div.innerHTML = `
      <span class="verse-num">${v.verse}</span> ${v.text}
    `;

    div.addEventListener("click", (e) => {
      e.stopPropagation();
      activeVerseEl = div;
      activeVerseId = verseId;
      palette.classList.remove("hidden");
    });

    versesEl.appendChild(div);
  });
}

// =======================
// PALETTE COLOR PICK
// =======================
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

// =======================
// CLEAR HIGHLIGHT
// =======================
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

// =======================
// CLOSE PALETTE
// =======================
document.addEventListener("click", (e) => {
  if (!palette.contains(e.target) && !e.target.closest(".verse")) {
    palette.classList.add("hidden");
  }
});

// =======================
// EVENTS
// =======================
bookSelect.onchange = () => {
  currentBook = bookSelect.value;
  loadChapters();
};

chapterSelect.onchange = () => {
  currentChapter = chapterSelect.value;
  loadVerses();
};

// =======================
// THEME TOGGLE
// =======================
themeToggle.onclick = () => {
  const isLight = document.body.classList.toggle("light");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
};

function searchBible(query) {
  searchResults.innerHTML = "";
  if (!query || query.length < 2) return;

  const q = query.toLowerCase();

  bible.forEach(book => {
    book.chapters.forEach(ch => {
      ch.verses.forEach(v => {
        if (v.text.toLowerCase().includes(q)) {
          const item = document.createElement("div");
          item.className = "search-item";

          item.innerHTML = `
            <div class="search-ref">${book.name} ${ch.chapter}:${v.verse}</div>
            <div>${v.text}</div>
          `;

          item.onclick = () => {
            currentBook = book.name;
            currentChapter = ch.chapter;

            bookSelect.value = book.name;
            loadChapters();
            chapterSelect.value = ch.chapter;
            loadVerses();

            setTimeout(() => {
              const verseId = `${book.name}-${ch.chapter}-${v.verse}`;
              const verseEl = document.querySelector(
                `.verse[data-id="${verseId}"]`
              );
              if (verseEl) {
                verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
                verseEl.classList.add("search-hit");
                setTimeout(() => verseEl.classList.remove("search-hit"), 1200);
              }
            }, 300);

            searchScreen.classList.add("hidden");
          };

          searchResults.appendChild(item);
        }
      });
    });
  });
}
searchInput.addEventListener("input", (e) => {
  searchBible(e.target.value);
});
function openSearch() {
  searchScreen.classList.remove("hidden");
  searchInput.focus();
}
openSearchBtn.onclick = () => {
  searchScreen.classList.remove("hidden");
  searchInput.focus();
};
