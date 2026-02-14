import {
  getTitleById,
  pickTitle,
  pickYear,
  pickImage,
  pickPlot,
} from "./api.js";

const statusEl = document.getElementById("status");
const wrap = document.getElementById("wrap");

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function chip(text) {
  return `<span class="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-white/80">${text}</span>`;
}

async function load() {
  const id = getParam("id");
  if (!id) {
    statusEl.textContent = "ID topilmadi (detail.html?id=...)";
    return;
  }

  statusEl.textContent = "Loading...";

  try {
    const item = await getTitleById(id);

    const title = pickTitle(item);
    const year = pickYear(item);
    const img = pickImage(item);
    const plot = pickPlot(item);

    const rating =
      item?.ratingsSummary?.aggregateRating || item?.rating || item?.imdbRating;

    const votes = item?.ratingsSummary?.voteCount || item?.votes;

    const genres = item?.genres?.genres?.map((g) => g.text) || [];

    wrap.innerHTML = `
  <div class="relative min-h-[420px] md:min-h-[520px]">
    ${
      img
        ? `<img src="${img}" alt="${title}" class="absolute inset-0 w-full h-full object-cover opacity-50" />`
        : `<div class="absolute inset-0 bg-white/5"></div>`
    }

    <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10"></div>
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="relative p-6 md:p-12 max-w-[620px]">
      <h1 class="text-4xl md:text-6xl font-light tracking-wide mb-3">${title}</h1>

      <div class="flex flex-wrap items-center gap-3 text-white/75 text-sm md:text-base mb-4">
        <span>${item?.titleType?.text || "Movie"}</span>
        <span class="w-1 h-1 rounded-full bg-white/40"></span>
        <span>${year || ""}</span>
        <span class="w-1 h-1 rounded-full bg-white/40"></span>
        <span>${item?.releaseDate?.month ? `Channel ${item.releaseDate.month}` : "Channel 34"}</span>
      </div>

      <p class="text-white/80 leading-relaxed text-sm md:text-base max-w-[520px] mb-6">
        ${plot}
      </p>

      <a href="https://www.netflix.com/uz-ru/"
         class="inline-flex items-center px-6 py-3 rounded-full bg-[#E11D48] hover:bg-[#F43F5E] transition font-semibold">
        Watch Now
      </a>
    </div>
  </div>
`;

    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Xatolik: " + err.message;
  }
}

load();
