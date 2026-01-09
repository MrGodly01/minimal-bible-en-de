const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesDiv = document.getElementById("verses");
const searchBtn = document.getElementById("searchBtn");
const searchWrapper = document.getElementById("searchWrapper");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let bible = {};
let highlights = JSON.parse(localStorage.getItem("hl") || "{}");

fetch("data/kjv.json")
  .then(r => r.json())
  .then(d => {
    bible = d.books.reduce((o,b)=>{o[b.name]=b.chapters;return o;},{});
    loadBooks();
  });

function loadBooks() {
  bookSelect.innerHTML = "";
  Object.keys(bible).forEach(b => {
    bookSelect.innerHTML += `<option>${b}</option>`;
  });
  loadChapters();
}

function loadChapters() {
  chapterSelect.innerHTML = "";
  bible[bookSelect.value].forEach((_,i)=>{
    chapterSelect.innerHTML += `<option>${i+1}</option>`;
  });
  loadVerses();
}

function loadVerses() {
  versesDiv.innerHTML = "";
  const verses = bible[bookSelect.value][chapterSelect.value-1].verses;

  verses.forEach(v => {
    const key = `${bookSelect.value}-${chapterSelect.value}-${v.verse}`;
    const color = highlights[key] || "";

    const div = document.createElement("div");
    div.className = "verse";
    div.innerHTML = `
      <span class="verse-number">${v.verse}</span>
      <span class="verse-text ${color}" data-key="${key}">
        ${v.text}
      </span>
    `;
    div.querySelector(".verse-text").onclick = e => toggleHighlight(e.target);
    versesDiv.appendChild(div);
  });
}

function toggleHighlight(el) {
  const key = el.dataset.key;
  const colors = ["", "blue", "green", "yellow"];
  const current = highlights[key] || "";
  const next = colors[(colors.indexOf(current) + 1) % colors.length];

  el.className = "verse-text " + next;

  if (next) highlights[key] = next;
  else delete highlights[key];

  localStorage.setItem("hl", JSON.stringify(highlights));
}

/* SEARCH */
searchBtn.onclick = () => {
  searchWrapper.style.display =
    searchWrapper.style.display === "block" ? "none" : "block";
};

searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll(".verse").forEach(v => {
    v.style.display = v.innerText.toLowerCase().includes(q) ? "block" : "none";
  });
};

bookSelect.onchange = loadChapters;
chapterSelect.onchange = loadVerses;
