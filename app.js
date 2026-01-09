const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const englishText = document.getElementById("englishText");
const themeToggle = document.getElementById("themeToggle");

let bible = {};

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("light") ? "🌙" : "☀︎";
};

// Load Bible
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books;
    loadBooks();
  })
  .catch(() => {
    englishText.textContent = "Failed to load Bible.";
  });

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
  book.chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch.chapter;
    opt.textContent = ch.chapter;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

function loadVerses() {
  englishText.innerHTML = "";
  const book = bible.find(b => b.name === bookSelect.value);
  const chapter = book.chapters.find(
    c => c.chapter == chapterSelect.value
  );

  chapter.verses.forEach(v => {
    const div = document.createElement("div");
    div.className = "verse";
    div.innerHTML = `<strong>${v.verse}</strong> ${v.text}`;
    englishText.appendChild(div);
  });
}

bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;
