// Fetch the live results.json and render it, so a schema change on the site shows up here before visitors see an error.
import { SOURCE, render } from "../leaderboard.js";

const res = await fetch(SOURCE, { cache: "no-cache" });
if (!res.ok) throw new Error(`${SOURCE}: HTTP ${res.status}`);
const R = await res.json();
for (const lang of ["en", "he"]) render(R, lang);
console.log(`ok: ${SOURCE} (${R.schema}, updated ${R.updated}) renders in English and Hebrew`);
