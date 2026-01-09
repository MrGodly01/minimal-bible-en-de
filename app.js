const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesEl = document.getElementById("verses");
const themeToggle = document.getElementById("themeToggle");

let bible = {};

// THEME
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};

// LOAD BIBLE
fetch("data/kjv.json")
  .then(res => res.json())
  .then(data => {
    bible = data.books;
    loadBooks();
  })
  .catch(err => {
    versesEl.textContent = "Failed to load Bible data";
    console.error(err);
  });

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

function loadChapters() {
  chapterSelect.innerHTML = "";
  const book = bible[bookSelect.value];
  book.chapters.forEach((c, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Chapter ${c.chapter}`;
    chapterSelect.appendChild(opt);
  });
  loadVerses();
}

function loadVerses() {
  versesEl.innerHTML = "";
  const book = bible[bookSelect.value];
  const chapter = book.chapters[chapterSelect.value];

  chapter.verses.forEach(v => {
    const id = `${book.name}-${chapter.chapter}-${v.verse}`;

    const div = document.createElement("div");
    div.className = "verse";
    div.dataset.id = id;

    div.innerHTML = `
      <span class="verse-number">${v.verse}</span>
      ${v.text}
      <div class="verse-actions">
        <button onclick="favorite('${id}')">❤️</button>
        <button onclick="highlight('${id}','yellow')">🟡</button>
        <button onclick="highlight('${id}','blue')">🔵</button>
        <button onclick="highlight('${id}','green')">🟢</button>
        <button onclick="note('${id}')">📝</button>
      </div>
    `;

    versesEl.appendChild(div);
  });

  applySaved();
}

bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;

// STORAGE
function getData() {
  return JSON.parse(localStorage.getItem("bible") || "{}");
}

function saveData(d) {
  localStorage.setItem("bible", JSON.stringify(d));
}

function favorite(id) {
  const d = getData();
  d[id] = d[id] || {};
  d[id].fav = !d[id].fav;
  saveData(d);
  applySaved();
}

function highlight(id, color) {
  const d = getData();
  d[id] = d[id] || {};
  d[id].color = color;
  saveData(d);
  applySaved();
}

function note(id) {
  const text = prompt("Add note:");
  if (!text) return;
  const d = getData();
  d[id] = d[id] || {};
  d[id].note = text;
  saveData(d);
}

function applySaved() {
  const d = getData();
  document.querySelectorAll(".verse").forEach(v => {
    v.classList.remove("yellow", "blue", "green", "favorite");
    const id = v.dataset.id;
    if (d[id]) {
      if (d[id].color) v.classList.add(d[id].color);
      if (d[id].fav) v.classList.add("favorite");
    }
  });
}
