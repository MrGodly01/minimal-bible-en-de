const versesEl = document.getElementById("verses");
const palette = document.getElementById("highlightPalette");
const debug = document.getElementById("debug");

// HARD TEST VERSE (NO JSON)
const testVerse = document.createElement("div");
testVerse.className = "verse";
testVerse.innerHTML = `<span class="verse-num">1</span> Tap me`;
versesEl.appendChild(testVerse);

debug.textContent = "JS LOADED";

// TAP TEST
testVerse.addEventListener("click", (e) => {
  e.stopPropagation();
  debug.textContent = "VERSE CLICKED";
  palette.classList.remove("hidden");
});

// COLOR PICK TEST
document.querySelectorAll(".palette-colors span").forEach(dot => {
  dot.addEventListener("click", (e) => {
    e.stopPropagation();
    debug.textContent = "COLOR PICKED";
    testVerse.classList.add(dot.dataset.color);
    palette.classList.add("hidden");
  });
});

// CLOSE TEST
document.addEventListener("click", () => {
  debug.textContent = "SCREEN CLICK";
  palette.classList.add("hidden");
});
