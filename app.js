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

    if (notes[id]) {
  div.classList.add("has-note");
}

    div.innerHTML = `
      <span class="verse-num">${v.verse}</span>
      <span class="verse-text">${v.text}</span>
      <button class="note-btn">📝</button>
    `;

    // NOTE BUTTON CLICK (STRONG)
    const noteBtn = div.querySelector(".note-btn");
    noteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      openNoteEditor(id);
    });

    // VERSE CLICK (HIGHLIGHT)
    div.addEventListener("click", (e) => {
      if (e.target.classList.contains("note-btn")) return;

      e.stopPropagation();
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

// Active state helper
function setActive(btn) {
  document.querySelectorAll(".pixel-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// HOME
navHome.onclick = () => {
  if (searchScreen) searchScreen.classList.add("hidden");
  setActive(navHome);
};

// SEARCH
navSearch.onclick = () => {
  if (searchScreen) searchScreen.classList.remove("hidden");
  setActive(navSearch);
};

// THEME (reuses your existing theme toggle)
navTheme.onclick = () => {
  document.body.classList.toggle("light");
  setActive(navTheme);
};

// NOTES (placeholder for now)
navNotes.onclick = () => {
  alert("Notes coming soon ✍️");
  setActive(navNotes);
};

// SEARCH
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

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

          // 🔥 THIS IS THE MAGIC
        div.onclick = () => {
  // Switch book
  bookSelect.value = book.name;
  currentBook = book.name;
  loadChapters();

  // Switch chapter AFTER chapters load
  setTimeout(() => {
    chapterSelect.value = ch.chapter;
    currentChapter = ch.chapter;
    loadVerses();

    // Scroll to verse AFTER verses load
    setTimeout(() => {
      const verseId = `${book.name}-${ch.chapter}-${v.verse}`;
      const verseEl = document.querySelector(`[data-id="${verseId}"]`);

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
  document.getElementById("searchScreen").classList.add("hidden");
};

            // set book
            bookSelect.value = book.name;
            currentBook = book.name;
            loadChapters();

            // set chapter
            chapterSelect.value = ch.chapter;
            currentChapter = ch.chapter;
            loadVerses();

            // scroll to verse
            setTimeout(() => {
              const verseEl = document.querySelector(
                `[data-id="${book.name}-${ch.chapter}-${v.verse}"]`
              );
              if (verseEl) {
                verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
                verseEl.classList.add("pulse");
              }
            }, 300);

            // close search
            document.getElementById("searchScreen").classList.add("hidden");
          };

          searchResults.appendChild(div);
        }
      });
    });
  });
};
