const versesEl = document.getElementById("verses");
const palette = document.getElementById("highlightPalette");
// TAP TEST
testVerse.addEventListener("click", (e) => {
  e.stopPropagation();
  palette.classList.remove("hidden");
});

// COLOR PICK TEST
document.querySelectorAll(".palette-colors span").forEach(dot => {
  dot.addEventListener("click", (e) => {
    e.stopPropagation();
    testVerse.classList.add(dot.dataset.color);
    palette.classList.add("hidden");
  });
});

// CLOSE TEST
document.addEventListener("click", () => {
  palette.classList.add("hidden");
});
