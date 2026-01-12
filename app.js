// ================== ELEMENTS ==================
const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const palette = document.getElementById("highlightPalette");
const clearHighlightBtn = document.getElementById("clearHighlight");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchScreen = document.getElementById("searchScreen");

const navHome = document.getElementById("navHome");
const navBible = document.getElementById("navBible");
const navSettings = document.getElementById("navSettings");

const homeScreen = document.getElementById("homeScreen");
const bibleScreen = document.getElementById("bibleScreen");
const settingsScreen = document.getElementById("settingsScreen");

const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");
const fontSlider = document.getElementById("fontSlider");

const noteEditor = document.getElementById("noteEditor");
const noteText = document.getElementById("noteText");
const saveNoteBtn = document.getElementById("saveNote");

const continueBox = document.getElementById("continueReading");
const continueText = document.getElementById("continueText");

// ================== STATE ==================
let activeVerseEl = null;
let activeVerseId = null;

let highlights = JSON.parse(localStorage.getItem("highlights")) || {};
let notes = JSON.parse(localStorage.getItem("notes")) || {};
let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
let highlightHistory = JSON.parse(localStorage.getItem("highlightHistory")) || [];

let bible = [];
let bibleDE = [];

// ================== LOAD BIBLE ==================
Promise.all([
  fetch("data/kjv.json").then(r => r.json()),
  fetch("data/luther1912.json").then(r => r.json())
])
.then(([en, de]) => {
  bible = en.books;
  bibleDE = de.books || de;
  loadBooks();
  loadVerseOfTheDay();
  loadContinueReading();
})
.catch(err => console.error("Bible load error:", err));

// ================== VERSE OF THE DAY ==================
function loadVerseOfTheDay() {
  if (!bible.length) return;

  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem("verseOfDay"));

  if (saved && saved.date === today) {
    renderVerseOfDay(saved);
    return;
  }

  const book = bible[Math.floor(Math.random() * bible.length)];
  const chapter = book.chapters[Math.floor(Math.random() * book.chapters.length)];
  const verse = chapter.verses[Math.floor(Math.random() * chapter.verses.length)];

  const data = {
    date: today,
    text: verse.text,
    ref: `${book.name} ${chapter.chapter}:${verse.verse}`
  };

  localStorage.setItem("verseOfDay", JSON.stringify(data));
  renderVerseOfDay(data);
}

function renderVerseOfDay(data) {
  const textEl = document.getElementById("dailyVerseText");
  const refEl = document.getElementById("dailyVerseRef");
  if (!textEl || !refEl) return;

  textEl.textContent = data.text;
  refEl.textContent = data.ref;
}

// ================== BOOKS / CHAPTERS ==================
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

function loadChapters() {
  chapterSelect.innerHTML = "";
  const book = bible.find(b => b.name === bookSelect.value);
  if (!book) return;

  book.chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch.chapter;
    opt.textContent = ch.chapter;
    chapterSelect.appendChild(opt);
  });

  loadVerses();
}

// ================== VERSES ==================
function loadVerses() {
  versesEl.innerHTML = "";

  const book = bible.find(b => b.name === bookSelect.value);
  if (!book) return;

  const chapter = book.chapters.find(c => c.chapter == chapterSelect.value);
  if (!chapter) return;

  localStorage.setItem("lastRead", JSON.stringify({
    book: book.name,
    chapter: chapter.chapter
  }));

  chapter.verses.forEach(v => {
    const div = document.createElement("div");
    div.className = "verse";

    const id = `${book.name}-${chapter.chapter}-${v.verse}`;
    div.dataset.id = id;

    if (highlights[id]) div.classList.add(highlights[id]);
    if (notes[id]) div.classList.add("has-note");

    let deText = "—";
    const deBook = bibleDE.find(b => b.name === book.name);
    if (deBook) {
      const deChapter = deBook.chapters.find(c => c.chapter == chapter.chapter);
      if (deChapter) {
        const deVerse = deChapter.verses.find(x => x.verse == v.verse);
        if (deVerse) deText = deVerse.text;
      }
    }

    div.innerHTML = `
      <div class="verse-en"><b>${v.verse}</b> ${v.text}</div>
      <div class="verse-de">${deText}</div>
      <button class="note-btn">📝</button>
      <button class="fav-btn">⭐</button>
    `;

    const favBtn = div.querySelector(".fav-btn");
    if (favorites[id]) favBtn.classList.add("active");

    favBtn.onclick = (e) => {
      e.stopPropagation();
      favorites[id]
        ? delete favorites[id]
        : favorites[id] = { book: book.name, chapter: chapter.chapter, verse: v.verse, text: v.text };
      favBtn.classList.toggle("active");
      localStorage.setItem("favorites", JSON.stringify(favorites));
    };

    div.onclick = () => {
      activeVerseEl = div;
      activeVerseId = id;
      palette.classList.remove("hidden");
    };

    versesEl.appendChild(div);
  });
}

// ================== CONTINUE READING ==================
function loadContinueReading() {
  const last = JSON.parse(localStorage.getItem("lastRead"));
  if (last) continueText.textContent = `${last.book} ${last.chapter}`;
}

continueBox.onclick = () => {
  const last = JSON.parse(localStorage.getItem("lastRead"));
  if (!last) return;

  bookSelect.value = last.book;
  loadChapters();
  setTimeout(() => {
    chapterSelect.value = last.chapter;
    loadVerses();
    showScreen(bibleScreen);
    setActiveNav(navBible);
  }, 200);
};

// ================== NAVIGATION ==================
function showScreen(screen) {
  homeScreen.classList.remove("active");
  bibleScreen.classList.remove("active");
  settingsScreen.classList.remove("active");
  screen.classList.add("active");
}

function setActiveNav(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

navHome.onclick = () => { showScreen(homeScreen); setActiveNav(navHome); };
navBible.onclick = () => { showScreen(bibleScreen); setActiveNav(navBible); };
navSettings.onclick = () => { showScreen(settingsScreen); setActiveNav(navSettings); };

// ================== SETTINGS ==================
fontSlider.oninput = () => {
  document.documentElement.style.setProperty("--verse-size", fontSlider.value + "px");
  localStorage.setItem("fontSize", fontSlider.value);
};

langToggle.onclick = () => {
  document.body.classList.toggle("hide-de");
  localStorage.setItem("lang",
    document.body.classList.contains("hide-de") ? "en" : "both"
  );
};

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
};

// ================== EVENTS ==================
bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;

function updateGreeting() {
  const h = new Date().getHours();
  const greeting =
    h < 12 ? "Good Morning" :
    h < 18 ? "Good Afternoon" :
    "Good Evening";

  document.getElementById("greeting").textContent = greeting;
  document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
}

updateGreeting();
