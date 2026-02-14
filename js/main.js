import {
  getTitles,
  pickId,
  pickTitle,
  pickYear,
  pickImage,
  pickPlot,
} from "./api.js";

const topRow = document.getElementById("topRow");
const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");

const heroImg = document.getElementById("heroImg");
const heroMeta = document.getElementById("heroMeta");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroBtn = document.getElementById("heroBtn");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageText = document.getElementById("pageText");

let page = 1;
let q = "";
let cachedItems = [];
let heroItem = null;

function cardHTML(item) {
  const id = pickId(item);
  const img = pickImage(item);
  const title = pickTitle(item);

  return `
    <a href="./detail.html?id=${encodeURIComponent(id)}"
       class="group overflow-hidden transition block">
      <div class="aspect-[2/3] overflow-hidden relative">
        ${
          img
            ? `<img src="${img}" alt="${title}" class="w-full h-full object-cover group-hover:scale-[1.03] transition" loading="lazy" />`
            : `<div class="w-full h-full grid place-items-center text-white/35 text-xs">No image</div>`
        }
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
    </a>
  `;
}


function topPosterHTML(item, activeId) {}

function renderHero(item) {}

function renderTopRow() {
  const activeId = heroItem ? pickId(heroItem) : "";
  topRow.innerHTML = cachedItems
    .slice(0, 12)
    .map((it) => topPosterHTML(it, activeId))
    .join("");
}

function bindTopRowClicks() {
  topRow.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;

    const id = btn.dataset.id;
    const found = cachedItems.find((x) => pickId(x) === id);
    if (found) {
      heroItem = found;
      renderHero(heroItem);
      renderTopRow();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

async function load() {
  statusEl.textContent = "Loading...";
  grid.innerHTML = "";
  topRow.innerHTML = "";

  try {
    const { items } = await getTitles({ page, limit: 25, q });
    cachedItems = items;

    if (!heroItem && items[0]) heroItem = items[0];
    renderHero(heroItem);

    renderTopRow();
    grid.innerHTML = items.map(cardHTML).join("");

    statusEl.textContent = `Loaded: ${items.length} items`;
    pageText.textContent = `Page: ${page}`;
  } catch (err) {
    statusEl.textContent = "Xatolik: " + err.message;
  }
}

function doSearch(value) {
  q = (value || "").trim();
  page = 1;
  heroItem = null;
  load();
}

searchBtn?.addEventListener("click", () => doSearch(searchInput.value));
searchInput?.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && doSearch(searchInput.value),
);

searchBtnMobile?.addEventListener("click", () =>
  doSearch(searchInputMobile.value),
);
searchInputMobile?.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && doSearch(searchInputMobile.value),
);

prevBtn.addEventListener("click", () => {
  page = Math.max(1, page - 1);
  load();
});

nextBtn.addEventListener("click", () => {
  page = page + 1;
  load();
});

bindTopRowClicks();
load();
