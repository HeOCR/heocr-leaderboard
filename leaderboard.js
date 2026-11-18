/**
 * The HeOCR leaderboard: every figure comes from one file, the HeOCR site's public benchmarks/results.json.
 * Nothing here holds a number. render() turns that file into HTML; boot() fetches it and draws the page.
 * render() is pure (no DOM), so the tests run it under Node.
 */

export const SOURCE = "https://heocr.github.io/benchmarks/results.json";
export const SITE_PAGE = { en: "https://heocr.github.io/benchmarks.html", he: "https://heocr.github.io/he/benchmarks.html" };
export const REPO = "https://github.com/HeOCR/heocr-leaderboard";
export const KNOWN_SCHEMA = "heocr_site_benchmarks.v0";

/** The domains, in the order shown. */
export const DOMAINS = ["documents", "p_mod", "p_hist", "handwriting", "vendors"];

/** Error measures; every other measure is a recall (higher is better). */
const LOWER = new Set(["cer", "wer", "rows_silent", "silent_loss"]);
/** heocr first, then stock Tesseract (always a column), then the open alternatives; any other reader after them. */
const READER_ORDER = ["heocr", "stock", "docling", "markitdown", "pymupdf4llm"];
const MEASURE_ORDER = ["cer", "wer", "number_recall", "silent_loss", "labels", "rows_read", "rows_silent", "image_word_recall"];

export const T = {
  en: {
    dir: "ltr",
    other: "עברית",
    title: "HeOCR leaderboard",
    lede: "Hebrew OCR and document reading, per kind of document. Every figure is read from HeOCR's public results file, {json}, the same file behind the {site}.",
    site: "benchmarks page",
    loading: "Loading results.json…",
    load_error: "Could not load results.json ({why}). The figures are also on the {site}.",
    schema_error: "results.json has a format this page does not know ({schema}), so nothing is shown rather than a guess. The figures are on the {site}.",
    updated: "Updated {d}.",
    how: "Each cell gives the value, its 95% interval in brackets, and n, the number of documents or pages it is measured on. Error rates: lower is better. Recall measures: higher is better. Every table says which.",
    ours: "HeOCR's own readers are highlighted.",
    lower: "lower is better",
    higher: "higher is better",
    no_interval: "no interval",
    not_handled: "does not read this format",
    not_scored: "no score",
    n_docs: "{n}",
    n_of: "{n} of {total}",
    n_pages: "{n} pages",
    gate_h: "Release gate",
    gate_status: { not_run: "Not yet run" },
    gate_t: "The release gate scores HeOCR on fresh sets made after its code is frozen, then decides whether the release ships. Its verdicts will appear here. Until then, the figures below are measurements, not release verdicts.",
    gate_other: "The verdict is on the {site}.",
    toc: "Domains",
    h: { documents: "Documents by format", p_mod: "Modern printed Hebrew", p_hist: "Historical and rabbinic printed Hebrew", handwriting: "Handwriting", vendors: "Commercial OCR vendors" },
    status: { no_data: "No data yet", pending_review: "Pending", scored: "Scored" },
    empty: {
      p_mod: "No data yet. Reference pages are under human review; no number is shown until a reviewed set is scored.",
      handwriting: "No data yet. There is no scored handwriting set with real, human-checked references.",
      vendors: "Scores are pending human review of the reference pages.",
    },
    unknown_shape: "Figures for this domain are in a form this page does not show yet. See the {site}.",
    doc_sub: "Generated documents with exact gold (D-bench): Word files and PDFs of every kind HeOCR's document reader handles, made so the correct text is known exactly. One row per kind of document.",
    doc_flatter: "heocr is developed against these sets, so they are not held out and flatter it. The release gate scores a fresh set made after the code is frozen.",
    small_set: "This set is small: {p} pages from {c} books. Intervals are wide and most overlap, so read differences between engines as indications, not rankings.",
    format: "Kind of document",
    slice: "Pages",
    docs: "{n} documents",
    pages: "{p} pages, {c} books",
    too_small: "Too few books for an interval; shown for completeness.",
    not_scored_engine: "{e} has not been scored on these pages.",
    wer_note: "Word error counts inserted words as well as wrong and missing ones, so it can exceed 100%.",
    reader_note: "Each row lists the readers that handle that kind of document. Tesseract reads images only, so it is scored on scans; on PDF T6 it is scored on the image regions only.",
    t4_note: "T4 and T5 use the same scanned pages; heocr and Tesseract read both by OCR, so their figures match. T4 adds a wrong text layer, which the other readers use.",
    f: { measure: "Measure", ref: "Reference", licence: "Licence", interval: "Interval", run: "Run", code: "Scoring code", readers: "Reader versions", excluded: "Left out", set: "Set" },
    excluded: "{n} cases whose scores cannot be published",
    scorer: "{repo} at {commit}, scored {d}",
    m: {
      cer: "Character error (CER)", wer: "Word error (WER)", number_recall: "Numbers found", labels: "Section numbers correct",
      rows_read: "Table rows read", rows_silent: "Rows lost without a warning", silent_loss: "Text lost without a warning",
      image_word_recall: "Words in image regions found",
    },
    readers: { heocr: "heocr", stock: "Tesseract (tessdata_best heb)", docling: "Docling", markitdown: "MarkItDown", pymupdf4llm: "PyMuPDF4LLM" },
    cells: {
      DOCX: "Word (.docx)", DOC: "Legacy Word (.doc)", "PDF T1": "PDF with a correct text layer",
      "PDF T2": "PDF whose text layer is in visual (reversed) order", "PDF T3": "PDF with a broken but recoverable character map",
      "PDF T4": "Scan with a wrong OCR text layer", "PDF T5": "Scan, image only", "PDF T6": "Text layer plus text drawn as images",
      "PDF spread": "Two pages on one sheet", "Scanned tables": "Scanned pages with a ruled table",
    },
    slices: { all: "All pages", unpointed: "Without pointed (niqqud) pages", rabbinic: "Rabbinic print, without niqqud", square: "Standard square type", pointed: "Pointed text (niqqud) only" },
    submit_h: "How to submit",
    submit: [
      "Open an issue or a pull request in {repo} with your reader's name, version and licence, and its plain-text output for each document or page of the set you want scored.",
      "We do not post numbers computed elsewhere. HeOCR scores every submission itself with the public scorer, under the same normalisation as every other reader, and adds it to results.json; this board then shows it.",
      "Submissions are run once the D-bench sets and their scorer are public. Until then, open the issue anyway: it holds your place, and we run it then.",
      "Everything HeOCR releases is open, and so are the scores: no sign-in, no gating.",
    ],
    footer: "Built from {json}. Code: {repo} (Apache-2.0).",
  },
  he: {
    dir: "rtl",
    other: "English",
    title: "טבלת המובילים של HeOCR",
    lede: "זיהוי תווים וקריאת מסמכים בעברית, לפי סוג המסמך. כל מספר נקרא מקובץ התוצאות הפומבי של HeOCR, {json}, אותו קובץ שממנו נבנה {site}.",
    site: "דף מדדי הביצועים",
    loading: "טוען את results.json…",
    load_error: "לא ניתן לטעון את results.json ‏({why}). המספרים מופיעים גם ב{site}.",
    schema_error: "ל־results.json יש מבנה שהדף הזה לא מכיר ({schema}), ולכן לא מוצג דבר במקום ניחוש. המספרים מופיעים ב{site}.",
    updated: "עודכן {d}.",
    how: "בכל תא: הערך, רווח בר־סמך של 95% בסוגריים, ו־n, מספר המסמכים או העמודים שעליהם נמדד. שיעורי שגיאה: נמוך יותר עדיף. מדדי איתור: גבוה יותר עדיף. כל טבלה מציינת זאת.",
    ours: "הקוראים של HeOCR מודגשים.",
    lower: "נמוך יותר עדיף",
    higher: "גבוה יותר עדיף",
    no_interval: "בלי רווח סמך",
    not_handled: "לא קורא את הפורמט הזה",
    not_scored: "אין ציון",
    n_docs: "{n}",
    n_of: "{n} מתוך {total}",
    n_pages: "{n} עמודים",
    gate_h: "שער השחרור",
    gate_status: { not_run: "עוד לא הורץ" },
    gate_t: "שער השחרור מעריך את HeOCR על קבוצות חדשות שנוצרות אחרי שהקוד מוקפא, ומחליט אם הגרסה משוחררת. ההחלטות יופיעו כאן. עד אז, המספרים שלמטה הם מדידות, לא החלטות שחרור.",
    gate_other: "ההחלטה מופיעה ב{site}.",
    toc: "תחומים",
    h: { documents: "מסמכים לפי פורמט", p_mod: "דפוס עברי מודרני", p_hist: "דפוס עברי היסטורי ורבני", handwriting: "כתב יד", vendors: "ספקי OCR מסחריים" },
    status: { no_data: "אין עדיין נתונים", pending_review: "ממתין", scored: "הוערך" },
    empty: {
      p_mod: "אין עדיין נתונים. דפי הייחוס נמצאים בבדיקה אנושית; לא יוצג מספר עד שתוערך קבוצה שנבדקה.",
      handwriting: "אין עדיין נתונים. אין קבוצת כתב יד מוערכת עם טקסט ייחוס אמיתי שנבדק בידי אדם.",
      vendors: "הציונים ממתינים לבדיקה אנושית של דפי הייחוס.",
    },
    unknown_shape: "המספרים בתחום הזה במבנה שהדף עוד לא מציג. ראו את {site}.",
    doc_sub: "מסמכים מחוללים עם טקסט נכון מדויק (D-bench): קובצי Word וקובצי PDF מכל הסוגים שקורא המסמכים של HeOCR מטפל בהם, שנוצרו כך שהטקסט הנכון ידוע במדויק. שורה לכל סוג מסמך.",
    doc_flatter: "heocr מפותח מול הקבוצות האלה, ולכן הן אינן מוחזקות בצד ומחמיאות לו. שער השחרור יעריך קבוצה חדשה שתיווצר אחרי שהקוד יוקפא.",
    small_set: "הקבוצה קטנה: {p} עמודים מ־{c} ספרים. רווחי הסמך רחבים ורובם חופפים, ולכן יש לקרוא את ההבדלים בין המנועים כסימנים, לא כדירוג.",
    format: "סוג המסמך",
    slice: "עמודים",
    docs: "{n} מסמכים",
    pages: "{p} עמודים, {c} ספרים",
    too_small: "מעט מדי ספרים לרווח סמך; מוצג לשלמות התמונה.",
    not_scored_engine: "{e} עוד לא הוערך על העמודים האלה.",
    wer_note: "שגיאת מילים סופרת גם מילים שנוספו, לא רק מילים שגויות או חסרות, ולכן היא יכולה לעלות על 100%.",
    reader_note: "בכל שורה מופיעים הקוראים שמטפלים בסוג המסמך שלה. Tesseract קורא תמונות בלבד, ולכן הוא מוערך על סריקות; ב־PDF T6 הוא מוערך על אזורי התמונה בלבד.",
    t4_note: "T4 ו־T5 משתמשים באותם עמודים סרוקים; heocr ו־Tesseract קוראים את שניהם ב־OCR, ולכן התוצאות שלהם זהות. ב־T4 נוספת שכבת טקסט שגויה, שבה משתמשים הקוראים האחרים.",
    f: { measure: "מדד", ref: "טקסט ייחוס", licence: "רישיון", interval: "רווח סמך", run: "הרצה", code: "קוד ההערכה", readers: "גרסאות הקוראים", excluded: "הושמטו", set: "קבוצה" },
    excluded: "{n} מקרים שאי אפשר לפרסם את הציונים שלהם",
    scorer: "{repo} בגרסה {commit}, הוערך ב־{d}",
    m: {
      cer: "שגיאת תווים (CER)", wer: "שגיאת מילים (WER)", number_recall: "מספרים שנמצאו", labels: "מספרי סעיפים נכונים",
      rows_read: "שורות טבלה שנקראו", rows_silent: "שורות שאבדו בלי אזהרה", silent_loss: "טקסט שאבד בלי אזהרה",
      image_word_recall: "מילים שנמצאו באזורי תמונה",
    },
    readers: { heocr: "heocr", stock: "Tesseract ‏(tessdata_best heb)", docling: "Docling", markitdown: "MarkItDown", pymupdf4llm: "PyMuPDF4LLM" },
    cells: {
      DOCX: "Word ‏(‎.docx‏)", DOC: "Word ישן ‏(‎.doc‏)", "PDF T1": "PDF עם שכבת טקסט תקינה",
      "PDF T2": "PDF ששכבת הטקסט שלו בסדר חזותי (הפוך)", "PDF T3": "PDF עם מפת תווים שבורה אך ניתנת לשחזור",
      "PDF T4": "סריקה עם שכבת OCR שגויה", "PDF T5": "סריקה, תמונה בלבד", "PDF T6": "שכבת טקסט ועוד טקסט שמצויר כתמונה",
      "PDF spread": "שני עמודים בגיליון אחד", "Scanned tables": "עמודים סרוקים עם טבלה",
    },
    slices: { all: "כל העמודים", unpointed: "בלי עמודים מנוקדים", rabbinic: "דפוס רבני, בלי ניקוד", square: "אותיות מרובעות רגילות", pointed: "טקסט מנוקד בלבד" },
    submit_h: "איך להגיש",
    submit: [
      "פתחו issue או pull request ב־{repo} עם שם הקורא, הגרסה והרישיון שלו, ופלט הטקסט שלו לכל מסמך או עמוד בקבוצה שאתם רוצים שתוערך.",
      "איננו מפרסמים מספרים שחושבו במקום אחר. HeOCR מעריך כל הגשה בעצמו בכלי ההערכה הפומבי, באותו נרמול כמו כל קורא אחר, ומוסיף אותה ל־results.json; הטבלה כאן מציגה אותה מיד אחר כך.",
      "ההגשות ירוצו כשקבוצות D-bench וכלי ההערכה שלהן יהיו פומביים. עד אז, פתחו את ה־issue בכל זאת: הוא שומר לכם מקום, ונריץ אותו אז.",
      "כל מה ש־HeOCR משחרר פתוח, וכך גם הציונים: בלי הרשמה ובלי הגבלת גישה.",
    ],
    footer: "נבנה מתוך {json}. הקוד: {repo} ‏(Apache-2.0).",
  },
};

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** A link only to an https address; anything else is shown as text. */
function link(href, text) {
  return typeof href === "string" && /^https:\/\//.test(href) ? `<a href="${esc(href)}">${text}</a>` : text;
}

/** Fill {name} slots: values are HTML already (callers escape). */
function fill(tpl, vals) {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vals ? String(vals[k]) : m));
}

/** As on the site: two decimals under 1%, one above. */
export function pct(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return "–";
  const v = 100 * x;
  return Math.abs(v) < 1 ? `${v.toFixed(2)}%` : `${v.toFixed(1)}%`;
}

const num = (s) => `<bdi dir="ltr">${s}</bdi>`;
const nNum = (n) => num(`n=${esc(n)}`);

/**
 * Hebrew for the descriptive strings results.json gives in English, keyed by the exact English text (from the site's
 * own Hebrew page). A string results.json changes is shown in English until it is added here.
 */
const HE_TEXT = {
  "audit2: 38 proofread pages from 14 Hebrew Wikisource Indexes (books), human-audited references":
    "audit2: ‏38 עמודים מוגהים מ־14 ספרים בוויקיטקסט העברי, עם טקסט ייחוס שנבדק בידי אדם",
  "hocrgen evaluate-references, profile primary.v1 (page text, ratio of sums over pages)":
    "hocrgen evaluate-references, פרופיל primary.v1 (טקסט העמוד, יחס של סכומים על פני העמודים)",
  "95% cluster bootstrap over Wikisource Indexes (2000 resamples, seed 20261106); none under 3 clusters":
    "bootstrap של 95% באשכולות לפי ספר בוויקיטקסט (2000 דגימות, seed 20261106); בלי רווח סמך מתחת ל־3 ספרים",
  "95% percentile bootstrap over documents, 2000 resamples, seed 0": "bootstrap של 95% על פני המסמכים (2000 דגימות, seed 0)",
  "Hebrew Wikisource proofread transcriptions": "תעתיקים מוגהים מוויקיטקסט העברי",
  "D-bench synthetic sets A, B and C: generated documents with exact gold; text from the public-domain Israeli official gazette (Reshumot)":
    "קבוצות D-bench מחוללות A, B ו־C: מסמכים שנוצרו עם טקסט נכון מדויק; הטקסט מתוך רשומות (העיתון הרשמי), נחלת הכלל",
};
const tr = (t, s) => (t === T.he && HE_TEXT[s]) || s;

/** One figure: the value, its 95% interval (or "no interval") and n. */
function figure(t, value, ci, nText, cls = "") {
  const iv = Array.isArray(ci) && ci.length === 2
    ? `<span class="ci">${num(`[${pct(ci[0]).replace(/%$/, "")}–${pct(ci[1])}]`)}</span>`
    : `<span class="ci">${esc(t.no_interval)}</span>`;
  return `<td class="num${cls}">${num(pct(value))}${iv}<span class="n">${nText}</span></td>`;
}

function dirLabel(t, m) {
  return LOWER.has(m) ? t.lower : t.higher;
}

/** Readers in a documents domain: the known order, then any reader results.json adds. Stock Tesseract is always a column. */
function readersOf(D) {
  const seen = new Set(READER_ORDER);
  const extra = [];
  for (const c of Object.values(D.cells)) for (const r of Object.keys(c.readers ?? {})) if (!seen.has(r)) { seen.add(r); extra.push(r); }
  return [...READER_ORDER, ...extra];
}

function measuresOf(cells) {
  const found = new Set();
  for (const c of Object.values(cells)) for (const rec of Object.values(c.readers ?? {})) for (const k of Object.keys(rec)) if (k !== "documents") found.add(k);
  return [...MEASURE_ORDER.filter((m) => found.has(m)), ...[...found].filter((m) => !MEASURE_ORDER.includes(m))];
}

function facts(rows) {
  return `<ul class="facts">${rows.filter(([, v]) => v).map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${v}</li>`).join("")}</ul>`;
}

/** Documents by format: one table per measure, a row per kind of document, a column per reader. */
export function documentsHtml(D, t) {
  const readers = readersOf(D);
  const out = [`<p class="sub">${esc(t.doc_sub)}</p>`, `<p class="warn">${esc(t.doc_flatter)}</p>`];
  measuresOf(D.cells).forEach((m, i) => {
    const rows = Object.entries(D.cells).filter(([, c]) => Object.values(c.readers ?? {}).some((r) => r[m]));
    if (!rows.length) return;
    out.push(`<details${i === 0 ? " open" : ""}><summary>${esc(t.m[m] ?? m)} <span class="dirtag">${esc(dirLabel(t, m))}</span></summary>`);
    out.push(`<div class="tablewrap"><table data-measure="${esc(m)}"><thead><tr><th>${esc(t.format)}</th>`);
    out.push(readers.map((r) => `<th${r === "heocr" ? ' class="ours"' : ""}>${esc(t.readers[r] ?? r)}</th>`).join(""));
    out.push(`</tr></thead><tbody>`);
    for (const [cell, c] of rows) {
      out.push(`<tr><th scope="row">${esc(t.cells[cell] ?? cell)}<span class="ci">${num(esc(cell))} · ${esc(fill(t.docs, { n: c.documents }))}</span></th>`);
      for (const r of readers) {
        const ours = r === "heocr" ? " ours" : "";
        const rec = c.readers?.[r];
        const x = rec?.[m];
        if (!rec) out.push(`<td class="na${ours}" title="${esc(t.not_handled)}">–</td>`);
        else if (!x) out.push(`<td class="na${ours}" title="${esc(t.not_scored)}">–</td>`);
        else {
          const n = x.n ?? rec.documents;
          const nText = n !== c.documents ? fill(esc(t.n_of), { n: nNum(n), total: num(esc(c.documents)) }) : fill(esc(t.n_docs), { n: nNum(n) });
          out.push(figure(t, x.value, x.ci95, nText, ours));
        }
      }
      out.push(`</tr>`);
    }
    out.push(`</tbody></table></div>`);
    if (m === "wer") out.push(`<p class="note">${esc(t.wer_note)}</p>`);
    out.push(`</details>`);
  });
  out.push(`<p class="note">${esc(t.reader_note)}</p>`);
  if (D.cells["PDF T4"]) out.push(`<p class="note">${esc(t.t4_note)}</p>`);
  const commit = /[0-9a-f]{40}/.exec(D.heocr ?? "")?.[0]?.slice(0, 7);
  const vers = Object.entries(D.baselines ?? {}).map(([k, v]) => `${esc(t.readers[k] ?? k)} ${esc(v.version ?? v.ocr ?? "")}`).join("; ");
  out.push(facts([
    [t.f.measure, D.measure && `<code>${esc(D.measure)}</code>`],
    [t.f.ref, D.reference && esc(tr(t, `${D.reference.name}: ${D.reference.source}`))],
    [t.f.licence, D.reference?.licence && esc(D.reference.licence)],
    [t.f.interval, D.interval && esc(tr(t, D.interval))],
    [t.f.run, D.run && esc(commit ? `${D.run}; heocr ${commit}` : D.run)],
    [t.f.readers, vers],
    [t.f.excluded, D.excluded_cases?.length && esc(fill(t.excluded, { n: D.excluded_cases.length }))],
  ]));
  return out.join("\n");
}

/** A page set with slices (historical print now; modern print and handwriting when they are scored in this shape). */
export function slicesHtml(P, t, { smallSet = false } = {}) {
  const engines = Object.keys(P.engines);
  const out = [];
  const all = P.slices.find((s) => s.id === "all") ?? P.slices[0];
  if (smallSet && all) out.push(`<p class="warn">${esc(fill(t.small_set, { p: all.pages, c: all.clusters }))}</p>`);
  const measures = MEASURE_ORDER.filter((m) => P.slices.some((s) => Object.values(s.engines).some((e) => e[m] !== undefined)));
  measures.forEach((m, i) => {
    out.push(`<details${i === 0 ? " open" : ""}><summary>${esc(t.m[m] ?? m)} <span class="dirtag">${esc(dirLabel(t, m))}</span></summary>`);
    out.push(`<div class="tablewrap"><table data-measure="${esc(m)}"><thead><tr><th>${esc(t.slice)}</th>`);
    out.push(engines.map((k) => {
      const meta = P.engines[k];
      return `<th${meta.ours ? ' class="ours"' : ""}>${link(meta.url, esc(meta.name ?? k))}</th>`;
    }).join(""));
    out.push(`</tr></thead><tbody>`);
    for (const s of P.slices) {
      const note = s.too_small ? `<span class="ci">${esc(t.too_small)}</span>` : "";
      out.push(`<tr><th scope="row">${esc(t.slices[s.id] ?? s.id)}<span class="ci">${esc(fill(t.pages, { p: s.pages, c: s.clusters }))}</span>${note}</th>`);
      for (const k of engines) {
        const ours = P.engines[k].ours ? " ours" : "";
        const row = s.engines[k];
        if (!row || row[m] === undefined || row[m] === null) out.push(`<td class="na${ours}" title="${esc(t.not_scored)}">–</td>`);
        else out.push(figure(t, row[m], row[`${m}_ci95`], fill(esc(t.n_pages), { n: nNum(s.pages) }), ours));
      }
      out.push(`</tr>`);
    }
    out.push(`</tbody></table></div>`);
    if (m === "wer") out.push(`<p class="note">${esc(t.wer_note)}</p>`);
    out.push(`</details>`);
  });
  for (const x of P.not_scored ?? []) out.push(`<p class="note">${esc(fill(t.not_scored_engine, { e: x }))}</p>`);
  const ref = P.reference ?? {};
  out.push(facts([
    [t.f.set, P.set && esc(tr(t, P.set))],
    [t.f.measure, P.measure && esc(tr(t, P.measure))],
    [t.f.ref, ref.name && `${link(ref.source_url, esc(tr(t, ref.source ?? ref.name)))} (<code>${esc(ref.name)}</code>)`],
    [t.f.licence, ref.licence && esc(ref.licence)],
    [t.f.interval, P.interval && esc(tr(t, P.interval))],
    [t.f.code, P.scorer && fill(esc(t.scorer), { repo: link(P.scorer.url, esc(P.scorer.repo)), commit: `<code>${esc(P.scorer.commit)}</code>`, d: esc(P.scored ?? "") })],
  ]));
  return out.join("\n");
}

function domainHtml(key, X, t, lang) {
  const site = link(SITE_PAGE[lang], esc(t.site));
  const status = X?.status ?? "no_data";
  const pill = `<span class="status s-${esc(status)}">${esc(t.status[status] ?? status)}</span>`;
  let body;
  if (status === "scored" && X.cells) body = documentsHtml(X, t);
  else if (status === "scored" && Array.isArray(X.slices) && X.engines) body = slicesHtml(X, t, { smallSet: key === "p_hist" });
  else if (status === "scored") body = `<div class="empty">${fill(esc(t.unknown_shape), { site })}</div>`;
  else body = `<div class="empty">${esc(t.empty[key] ?? t.status[status] ?? status)}</div>`;
  return `<section id="${key}"><h2>${esc(t.h[key])}</h2>${pill}\n${body}</section>`;
}

function gateHtml(R, t, lang) {
  const gate = R.documents?.gate ?? "not_run";
  const site = link(SITE_PAGE[lang], esc(t.site));
  const label = t.gate_status[gate] ?? gate;
  const more = gate === "not_run" ? "" : ` ${fill(esc(t.gate_other), { site })}`;
  return `<section id="release-gate" class="gate"><h2>${esc(t.gate_h)}</h2><span class="status s-${esc(gate)}">${esc(label)}</span>`
    + `<div class="empty">${esc(t.gate_t)}${more}</div></section>`;
}

function submitHtml(t) {
  const repo = link(REPO, "HeOCR/heocr-leaderboard");
  return `<section id="submit"><h2>${esc(t.submit_h)}</h2><ul class="submit">${t.submit.map((p) => `<li>${fill(esc(p), { repo })}</li>`).join("")}</ul></section>`;
}

/** The page body (everything under the header) from results.json. Throws on a schema it does not know. */
export function render(R, lang = "en") {
  const t = T[lang] ?? T.en;
  if (!R || typeof R !== "object" || R.schema !== KNOWN_SCHEMA) throw new SchemaError(R?.schema);
  const toc = DOMAINS.map((k) => `<a href="#${k}">${esc(t.h[k])}</a>`).join(" · ");
  return [
    `<p class="how">${esc(t.how)} ${esc(t.ours)}</p>`,
    `<p class="note">${esc(fill(t.updated, { d: R.updated }))}</p>`,
    gateHtml(R, t, lang),
    `<nav class="toc" aria-label="${esc(t.toc)}">${toc}</nav>`,
    ...DOMAINS.map((k) => domainHtml(k, R[k], t, lang)),
    submitHtml(t),
  ].join("\n");
}

export class SchemaError extends Error {
  constructor(schema) {
    super(`unknown schema ${schema}`);
    this.schema = schema;
  }
}

export function headerHtml(lang) {
  const t = T[lang] ?? T.en;
  const json = link(SOURCE, "<code>results.json</code>");
  const site = link(SITE_PAGE[lang], esc(t.site));
  return `<h1>${esc(t.title)}</h1><p class="lede">${fill(esc(t.lede), { json, site })}</p>`;
}

export function footerHtml(lang) {
  const t = T[lang] ?? T.en;
  return fill(esc(t.footer), { json: link(SOURCE, "<code>results.json</code>"), repo: link(REPO, "HeOCR/heocr-leaderboard") });
}

export function errorHtml(lang, err) {
  const t = T[lang] ?? T.en;
  const site = link(SITE_PAGE[lang], esc(t.site));
  if (err instanceof SchemaError) return `<div class="empty error">${fill(esc(t.schema_error), { schema: `<code>${esc(err.schema)}</code>`, site })}</div>`;
  return `<div class="empty error">${fill(esc(t.load_error), { why: esc(err?.message ?? err), site })}</div>`;
}

/** Browser only: fetch results.json once and draw the page; the language button redraws from the same data. */
export async function boot(doc = document) {
  const params = new URLSearchParams(doc.defaultView.location.search);
  let lang = params.get("lang") === "he" ? "he" : "en";
  try {
    const saved = doc.defaultView.localStorage.getItem("lang");
    if (!params.get("lang") && (saved === "he" || saved === "en")) lang = saved;
  } catch { /* storage may be blocked */ }
  let data = null;
  let failure = null;
  const main = doc.getElementById("main");
  const draw = () => {
    const t = T[lang];
    doc.documentElement.lang = lang;
    doc.documentElement.dir = t.dir;
    doc.title = t.title;
    doc.getElementById("head").innerHTML = headerHtml(lang);
    doc.getElementById("foot").innerHTML = footerHtml(lang);
    const btn = doc.getElementById("lang");
    btn.textContent = t.other;
    btn.lang = lang === "he" ? "en" : "he";
    if (failure) main.innerHTML = errorHtml(lang, failure);
    else if (data) {
      try { main.innerHTML = render(data, lang); } catch (e) { failure = e; main.innerHTML = errorHtml(lang, e); }
    } else main.innerHTML = `<p class="note">${esc(t.loading)}</p>`;
  };
  doc.getElementById("lang").addEventListener("click", () => {
    lang = lang === "he" ? "en" : "he";
    try { doc.defaultView.localStorage.setItem("lang", lang); } catch { /* ignore */ }
    draw();
  });
  draw();
  try {
    const res = await fetch(SOURCE, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e) {
    failure = e;
  }
  draw();
}
