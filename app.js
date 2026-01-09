const bookSelect = document.getElementById("book");
const chapterSelect = document.getElementById("chapter");
const versesDiv = document.getElementById("verses");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("themeToggle");

let bible = {};
let highlights = JSON.parse(localStorage.getItem("highlights") || "{}");

fetch("data/kjv.json")
  .then(r => r.json())
  .then(d => {
    bible = d.books.reduce((a,b)=>{a[b.name]=b.chapters;return a;},{});
    loadBooks();
  });

function loadBooks(){
  bookSelect.innerHTML="";
  Object.keys(bible).forEach(b=>{
    bookSelect.innerHTML+=`<option>${b}</option>`;
  });
  loadChapters();
}

function loadChapters(){
  chapterSelect.innerHTML="";
  bible[bookSelect.value].forEach((_,i)=>{
    chapterSelect.innerHTML+=`<option>${i+1}</option>`;
  });
  loadVerses();
}

function loadVerses(){
  versesDiv.innerHTML="";
  const verses=bible[bookSelect.value][chapterSelect.value-1].verses;
  verses.forEach(v=>{
    const key=`${bookSelect.value}-${chapterSelect.value}-${v.verse}`;
    const div=document.createElement("div");
    div.className="verse "+(highlights[key]||"");
    div.innerHTML=`<span class="verse-number">${v.verse}</span>${v.text}`;
    div.onclick=()=>toggleHighlight(key,div);
    versesDiv.appendChild(div);
  });
}

function toggleHighlight(key,el){
  const colors=["","highlight-blue","highlight-green","highlight-yellow"];
  const current=highlights[key]||"";
  const next=colors[(colors.indexOf(current)+1)%colors.length];
  el.className="verse "+next;
  if(next) highlights[key]=next;
  else delete highlights[key];
  localStorage.setItem("highlights",JSON.stringify(highlights));
}

bookSelect.onchange=loadChapters;
chapterSelect.onchange=loadVerses;

searchInput.oninput=()=>{
  document.querySelectorAll(".verse").forEach(v=>{
    v.style.display=v.textContent.toLowerCase().includes(searchInput.value.toLowerCase())?"block":"none";
  });
};

themeToggle.onclick=()=>{
  document.body.classList.toggle("light");
};
