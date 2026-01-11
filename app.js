const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const palette = document.getElementById("highlightPalette");
const clearHighlightBtn = document.getElementById("clearHighlight");

let activeVerseEl = null;
let activeVerseId = null;

// load saved highlights
let highlights = JSON.parse(localStorage.getItem("highlights")) || {};
let notes = JSON.parse(localStorage.getItem("notes")) || {};
let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
let highlightHistory =
  JSON.parse(localStorage.getItem("highlightHistory")) || [];

let bible = [];
let bibleDE = [];


// LOAD BIBLE
Promise.all([
  fetch("data/kjv.json").then(r => r.json()),
  fetch("data/luther1912.json").then(r => r.json())
])
.then(([en, de]) => {
  bible = en.books;
  bibleDE = de.books || de;
  loadBooks();
})
.catch(err => {
  versesEl.innerHTML = "<p style='color:red'>Failed to load Bible</p>";
  console.error("Bible load error:", err);
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

    if (highlights[id]) div.classList.add(highlights[id]);
    if (notes[id]) div.classList.add("has-note");

    // --- FIND GERMAN VERSE ---
    let deText = "—";
    const deBook = bibleDE.find(b => b.name === book.name);
    if (deBook) {
      const deChapter = deBook.chapters.find(
        c => c.chapter == chapter.chapter
      );
      if (deChapter) {
        const deVerse = deChapter.verses.find(
          x => x.verse == v.verse
        );
        if (deVerse) deText = deVerse.text;
      }
    }

   div.innerHTML = `
  <div class="verse-en">
    <span class="verse-num">${v.verse}</span>
    <span class="verse-text">${v.text}</span>
  </div>

  <div class="verse-de">
    ${deText}
  </div>

  <button class="note-btn">📝</button>
  <button class="fav-btn">⭐</button>
`;

// FAVORITE BUTTON
const favBtn = div.querySelector(".fav-btn");

// restore state
if (favorites[id]) favBtn.classList.add("active");

favBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();

  if (favorites[id]) {
    delete favorites[id];
    favBtn.classList.remove("active");
  } else {
    favorites[id] = {
      book: book.name,
      chapter: chapter.chapter,
      verse: v.verse,
      text: v.text
    };
    favBtn.classList.add("active");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
});


    // NOTE BUTTON
    const noteBtn = div.querySelector(".note-btn");
    noteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openNoteEditor(id);
    });

    // VERSE CLICK (HIGHLIGHT)
    div.addEventListener("click", (e) => {
      if (e.target.classList.contains("note-btn")) return;
      activeVerseEl = div;
      activeVerseId = id;
      palette.classList.remove("hidden");
    });

    versesEl.appendChild(div);
  });
}




// EVENTS
bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;
// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");
const fontSlider = document.getElementById("fontSlider");

// Load saved font size
const savedSize = localStorage.getItem("fontSize");
if (savedSize) {
  document.documentElement.style.setProperty(
    "--verse-size",
    savedSize + "px"
  );
  fontSlider.value = savedSize;
}

// Change font size
fontSlider.oninput = () => {
  const size = fontSlider.value;
  document.documentElement.style.setProperty(
    "--verse-size",
    size + "px"
  );
  localStorage.setItem("fontSize", size);
};

// load saved language preference
const savedLang = localStorage.getItem("lang");
if (savedLang === "en") {
  document.body.classList.add("hide-de");
  langToggle.textContent = "EN";
}

// toggle language
langToggle.onclick = () => {
  document.body.classList.toggle("hide-de");

  const isEnglishOnly = document.body.classList.contains("hide-de");
  langToggle.textContent = isEnglishOnly ? "EN" : "EN + DE";
  localStorage.setItem("lang", isEnglishOnly ? "en" : "both");
};

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

const noteEditor = document.getElementById("noteEditor");
const noteText = document.getElementById("noteText");
const saveNoteBtn = document.getElementById("saveNote");

let currentNoteVerseId = null;

// AUTO-SAVE NOTE WHILE TYPING
noteText.addEventListener("input", () => {
  if (!currentNoteVerseId) return;

  notes[currentNoteVerseId] = noteText.value;
  localStorage.setItem("notes", JSON.stringify(notes));
});

function openNoteEditor(id) {
  currentNoteVerseId = id;
  noteText.value = notes[id] || "";
  noteEditor.classList.remove("hidden");
}

saveNoteBtn.onclick = () => {
  if (!currentNoteVerseId) return;

  notes[currentNoteVerseId] = noteText.value;
  localStorage.setItem("notes", JSON.stringify(notes));

  loadVerses(); // update note indicator
  noteEditor.classList.add("hidden");
};

// Close editor when tapping outside
noteEditor.onclick = (e) => {
  if (e.target === noteEditor) {
    noteEditor.classList.add("hidden");
  }
};

// PIXEL NAV BAR LOGIC
const navHome = document.getElementById("navHome");
const navSearch = document.getElementById("navSearch");
const navTheme = document.getElementById("navTheme");
const navNotes = document.getElementById("navNotes");

const searchScreen = document.getElementById("searchScreen");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

function closeAllScreens() {
  searchScreen.classList.add("hidden");
  notesScreen.classList.add("hidden");
  favoritesScreen.classList.add("hidden");
}

// Active state helper
function setActive(btn) {
  document.querySelectorAll(".pixel-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// HOME
navHome.onclick = () => {
  closeAllScreens();
  setActive(navHome);
};

// SEARCH
navSearch.onclick = () => {
  closeAllScreens();
  searchScreen.classList.remove("hidden");
  setActive(navSearch);
};

// THEME (reuses your existing theme toggle)
navTheme.onclick = () => {
  document.body.classList.toggle("light");
  setActive(navTheme);
};

// NOTES (placeholder for now)
navNotes.onclick = () => {
  closeAllScreens();
  openNotesScreen();
  setActive(navNotes);
};

// SEARCH
searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();
  searchResults.innerHTML = "";

  if (q.length < 2) return;

  bible.forEach(book => {
    book.chapters.forEach(ch => {
      ch.verses.forEach(v => {
        if (v.text.toLowerCase().includes(q)) {
          const div = document.createElement("div");
          div.className = "search-result";

          div.innerHTML = `
            <div>${v.text.slice(0, 90)}...</div>
            <div class="search-ref">${book.name} ${ch.chapter}:${v.verse}</div>
          `;

          div.onclick = () => {
            // Switch book
            bookSelect.value = book.name;
            loadChapters();

            // Switch chapter AFTER chapters load
            setTimeout(() => {
              chapterSelect.value = ch.chapter;
              loadVerses();

              // Scroll to verse AFTER verses load
              setTimeout(() => {
                const verseId = `${book.name}-${ch.chapter}-${v.verse}`;
                const verseEl = document.querySelector(
                  `[data-id="${verseId}"]`
                );

                if (verseEl) {
                  verseEl.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                  });
                  verseEl.classList.add("pulse");
                }
              }, 200);
            }, 200);

            // Close search
            searchScreen.classList.add("hidden");
          };

          searchResults.appendChild(div);
        }
      });
    });
  });
};

const notesScreen = document.getElementById("notesScreen");
const favoritesScreen = document.getElementById("favoritesScreen");

function openNotesScreen() {
  notesScreen.innerHTML = "<h2>Notes</h2>";

  Object.keys(notes).forEach(id => {
    const div = document.createElement("div");
    div.className = "search-result";
    div.innerHTML = `
      <div>${notes[id]}</div>
      <div class="search-ref">${id}</div>
    `;
    div.onclick = () => jumpToVerse(id);
    notesScreen.appendChild(div);
  });

  notesScreen.classList.remove("hidden");
}

function openFavoritesScreen() {
  favoritesScreen.innerHTML = "<h2>Favorites</h2>";

  Object.values(favorites).forEach(f => {
    const div = document.createElement("div");
    div.className = "search-result";
    div.innerHTML = `
      <div>${f.text.slice(0, 90)}...</div>
      <div class="search-ref">${f.book} ${f.chapter}:${f.verse}</div>
    `;
    div.onclick = () =>
      jumpToVerse(`${f.book}-${f.chapter}-${f.verse}`);
    favoritesScreen.appendChild(div);
  });

  favoritesScreen.classList.remove("hidden");
}
function jumpToVerse(id) {
  const [book, chapter, verse] = id.split("-");
  bookSelect.value = book;
  loadChapters();

  setTimeout(() => {
    chapterSelect.value = chapter;
    loadVerses();

    setTimeout(() => {
      const el = document.querySelector(`[data-id="${id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("pulse");
      }
    }, 200);
  }, 200);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(() => console.log("PWA ready"))
      .catch(err => console.error("PWA error", err));
  });
}

const homeScreen = document.getElementById("homeScreen");
const bibleScreen = document.getElementById("bibleScreen");
const settingsScreen = document.getElementById("settingsScreen");

function showScreen(screen) {
  homeScreen.classList.remove("active");
  bibleScreen.classList.remove("active");
  settingsScreen.classList.remove("active");

  screen.classList.add("active");
}

function openBible() {
  showScreen(bibleScreen);
}

navHome.onclick = () => {
  showScreen(homeScreen);
};

navSearch.onclick = () => {
  showScreen(bibleScreen);
};

navNotes.onclick = () => {
  showScreen(settingsScreen);
};
