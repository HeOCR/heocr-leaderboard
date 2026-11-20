// node --test: render() against a snapshot of the site's public results.json (test/fixtures/results.json).
// The fixture is only for tests; the page itself always reads the live file (SOURCE).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { DOMAINS, KNOWN_SCHEMA, SOURCE, SchemaError, T, errorHtml, esc, pct, render } from "../leaderboard.js";

const R = JSON.parse(readFileSync(new URL("./fixtures/results.json", import.meta.url), "utf8"));
const clone = () => structuredClone(R);
const cells = (html) => [...html.matchAll(/<td class="num[^"]*">(.*?)<\/td>/g)].map((m) => m[1]);
const table = (html, id, m) => {
  const sec = html.slice(html.indexOf(`<section id="${id}">`));
  const start = sec.indexOf(`<table data-measure="${m}">`);
  return start < 0 ? null : sec.slice(start, sec.indexOf("</table>", start));
};

test("reads the site's file and nothing else", () => {
  assert.equal(SOURCE, "https://heocr.github.io/benchmarks/results.json");
  assert.equal(R.schema, KNOWN_SCHEMA);
});

test("every domain lead asked for has a section, in order, in both languages", () => {
  for (const lang of ["en", "he"]) {
    const html = render(R, lang);
    const at = DOMAINS.map((k) => html.indexOf(`<section id="${k}">`));
    assert.ok(at.every((i) => i >= 0), lang);
    assert.deepEqual([...at].sort((a, b) => a - b), at);
    assert.ok(html.includes('<section id="submit">'));
  }
});

test("every figure carries a 95% interval (or says it has none) and n", () => {
  const html = render(R, "en");
  const figs = cells(html);
  assert.ok(figs.length > 0, `only ${figs.length} figures`);
  for (const f of figs) {
    assert.match(f, /<span class="ci">(<bdi dir="ltr">\[[\d.]+–[\d.]+%\]<\/bdi>|no interval)<\/span>/, f);
    assert.match(f, /<span class="n"><bdi dir="ltr">n=\d+<\/bdi>( pages| of <bdi dir="ltr">\d+<\/bdi>)?<\/span>/, f);
  }
  // Only the too-small slice (2 pages, 1 book) lacks an interval.
  const noIv = figs.filter((f) => f.includes("no interval"));
  assert.equal(noIv.length, 2 * Object.keys(R.p_hist.engines).length);
});

test("every number on the page is a number from results.json", () => {
  const html = render(R, "en");
  const want = new Set();
  const walk = (x) => {
    if (typeof x === "number") want.add(pct(x));
    else if (x && typeof x === "object") Object.values(x).forEach(walk);
  };
  walk(R);
  for (const f of cells(html)) {
    const v = /^<bdi dir="ltr">([^<]+)<\/bdi>/.exec(f)[1];
    assert.ok(want.has(v), `${v} is not in results.json`);
  }
});

test("each displayed error measure states its direction", () => {
  const html = render(R, "en");
  for (const m of ["cer", "wer"]) {
    assert.ok(html.includes(`${T.en.m[m]} <span class="dirtag">lower is better</span>`));
  }
});

test("historical print: ours highlighted, both stock Tesseract engines shown, small-set warning from the data", () => {
  const html = render(R, "en");
  const cer = table(html, "p_hist", "cer");
  for (const [k, meta] of Object.entries(R.p_hist.engines)) {
    assert.ok(cer.includes(meta.ours ? '<th class="ours">' : "<th>"), k);
    assert.ok(cer.includes(esc(meta.name)), k);
  }
  assert.ok(cer.includes("Tesseract tessdata_best heb"));
  const all = R.p_hist.slices.find((s) => s.id === "all");
  assert.ok(html.includes(`This set is small: ${all.pages} pages from ${all.clusters} books.`));
  assert.ok(html.includes("R8b has not been scored on these pages."));
});

test("domains without data say so and show no figure", () => {
  const html = render(R, "en");
  for (const k of ["p_mod", "handwriting", "vendors"]) {
    const sec = html.slice(html.indexOf(`<section id="${k}">`)).split("</section>")[0];
    assert.equal(cells(sec).length, 0, k);
    assert.ok(sec.includes('class="empty"'), k);
  }
});

test("the fixture excludes generated results and the renderer never reads that field", () => {
  assert.ok(!Object.hasOwn(R, "documents"));
  const r = clone();
  Object.defineProperty(r, "documents", {
    get() { throw new Error("Generated results must not be read"); },
  });
  for (const lang of ["en", "he"]) assert.equal(render(r, lang), render(R, lang));
});

test("modern print or handwriting scored in the historical shape get the same table", () => {
  const r = clone();
  r.p_mod = structuredClone(r.p_hist);
  const html = render(r, "en");
  assert.ok(table(html, "p_mod", "cer"));
  assert.ok(!html.slice(html.indexOf('<section id="p_mod">')).split("</section>")[0].includes("This set is small"));
});

test("a scored domain in an unknown shape links to the site instead of guessing", () => {
  const r = clone();
  r.vendors = { status: "scored", something: [1, 2] };
  const sec = render(r, "en").split('<section id="vendors">')[1].split("</section>")[0];
  assert.equal(cells(sec).length, 0);
  assert.ok(sec.includes("https://heocr.github.io/benchmarks.html"));
});

test("an unknown schema is refused", () => {
  const r = clone();
  r.schema = "heocr_site_benchmarks.v1";
  assert.throws(() => render(r, "en"), SchemaError);
  assert.match(errorHtml("en", new SchemaError("x<y")), /x&lt;y/);
});

test("text from results.json is escaped and only https links are made", () => {
  const r = clone();
  r.p_hist.engines.R7.name = '<img src=x onerror="alert(1)">';
  r.p_hist.engines.R6.url = "javascript:alert(1)";
  r.p_hist.reference.source_url = "http://example.org";
  const html = render(r, "en");
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes("javascript:"));
  assert.ok(!html.includes('href="http://example.org"'));
});

test("Hebrew page has every label the English one has", () => {
  const keys = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
  assert.deepEqual(keys(T.he).sort(), keys(T.en).sort());
  assert.equal(T.he.submit.length, T.en.submit.length);
  const he = render(R, "he");
  assert.ok(he.includes("נמוך יותר עדיף"));
  assert.equal(cells(he).length, cells(render(R, "en")).length);
});

test("Hebrew facts use the site's Hebrew wording, and fall back to the English text when it changes", () => {
  const he = render(R, "he");
  assert.ok(he.includes("38 עמודים מוגהים מ־14 ספרים"));
  assert.ok(!he.includes("38 proofread pages"));
  const r = clone();
  r.p_hist.set = "a new set";
  assert.ok(render(r, "he").includes("a new set"));
});
