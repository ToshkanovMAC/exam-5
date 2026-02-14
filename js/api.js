const BASE = "https://api.imdbapi.dev";

export async function getTitles({ page = 1, limit = 25, q = "" } = {}) {
  const url = new URL(`${BASE}/titles`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("API error: " + res.status);
  const data = await res.json();

  const items = data.titles || data.results || data.data || [];
  return { items, raw: data };
}

export async function getTitleById(id) {
  const res = await fetch(`${BASE}/titles/${id}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("API error: " + res.status);
  return res.json();
}

export function pickId(item) {
  return item?.id || item?._id || "";
}

export function pickTitle(item) {
  return (
    item?.titleText?.text ||
    item?.originalTitleText?.text ||
    item?.primaryTitle ||
    item?.title ||
    item?.name ||
    "Untitled"
  );
}

export function pickYear(item) {
  return item?.releaseYear?.year || item?.year || item?.startYear || "";
}

export function pickImage(item) {
  return (
    item?.primaryImage?.url ||
    item?.image?.url ||
    item?.image ||
    item?.poster ||
    item?.posterUrl ||
    ""
  );
}

export function pickPlot(item) {
  return (
    item?.plot?.plotText?.plainText ||
    item?.plot ||
    item?.summary ||
    item?.description ||
    "Description not available."
  );
}
