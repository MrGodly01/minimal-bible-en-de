const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");

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
    div.innerHTML = `<span class="verse-num">${v.verse}</span> ${v.text}`;
    versesEl.appendChild(div);
  });
}

// EVENTS
bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;
