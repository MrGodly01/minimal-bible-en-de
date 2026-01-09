const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");

let bible = {};
let highlights = JSON.parse(localStorage.getItem("highlights") || "{}");

// LOAD BIBLE
fetch("./data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books;
    loadBooks();
  })
  .catch(err => {
    versesEl.innerHTML = "Failed to load Bible data";
    console.error(err);
  });

// LOAD BOOKS
function loadBooks() {
  bookSelect.innerHTML = "";
  bible.forEach((b, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = b.name;
    bookSelect.appendChild(opt);
  });
  loadChapters();
}

// LOAD CHAPTERS
function loadChapters() {
  chapterSelect.innerHTML = "";
  const book = bible[bookSelect.value];
  book.chapters.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.chapter;
    opt.textContent = c.chapter;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

// LOAD VERSES
function loadVerses() {
  versesEl.innerHTML = "";
  const book = bible[bookSelect.value];
  const chapter = book.chapters.find(c => c.chapter == chapterSelect.value);

  chapter.verses.forEach(v => {
    const id = `${book.name}-${chapter.chapter}-${v.verse}`;
    const div = document.createElement("div");
    div.className = "verse";
    if (highlights[id]) div.classList.add(highlights[id]);

    div.innerHTML = `<span class="verse-num">${v.verse}</span>${v.text}`;

    div.onclick = () => toggleHighlight(div, id);

    versesEl.appendChild(div);
  });
}

// HIGHLIGHT (single tap)
function toggleHighlight(el, id) {
  const colors = ["highlight-yellow", "highlight-blue", "highlight-green"];
  const current = highlights[id];
  const next = colors[(colors.indexOf(current) + 1) % colors.length];

  el.classList.remove(...colors);
  el.classList.add(next);

  highlights[id] = next;
  localStorage.setItem("highlights", JSON.stringify(highlights));
}

// EVENTS
bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;

// THEME TOGGLE
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};
