---
title: HeOCR leaderboard
emoji: 📜
colorFrom: blue
colorTo: gray
sdk: static
app_file: index.html
pinned: false
license: apache-2.0
short_description: Hebrew OCR and document reading benchmarks, per domain
---

# HeOCR leaderboard

A static leaderboard for [HeOCR](https://heocr.github.io), built to run as a Hugging Face Space (`sdk: static`).

It has one data source: the HeOCR site's public
[`benchmarks/results.json`](https://heocr.github.io/benchmarks/results.json), the same file behind the site's
[benchmarks page](https://heocr.github.io/benchmarks.html). The page fetches that file when it loads and holds no
number of its own, so it is current as soon as the site is. If the file's `schema` is not one the page knows, it
shows nothing but a link to the site rather than guess.

## What it shows

- **Release gate**: a placeholder until the gate verdict is in `results.json`.
- One section per domain, in this order: documents by format, modern print, historical print, handwriting,
  commercial vendors. A domain without scores says so and shows no figure.
- One table per measure, each labelled "lower is better" or "higher is better". Every cell gives the value, its 95%
  interval (or "no interval" where the set is too small for one) and n.
- HeOCR's own readers are highlighted. Stock Tesseract (tessdata_best heb) is always a column, with its score wherever
  it has one.
- English and Hebrew (the button at the top; `?lang=he` also works).
- How to submit a reader.

## Develop

No dependencies and no build step: `index.html`, `style.css` and `leaderboard.js` are the whole Space.

```
npm test                 # node --test: render() against a snapshot of results.json (test/fixtures/)
npm run check-live       # fetch the live results.json and render it in both languages
npm run serve            # http://localhost:8765
```

`test/fixtures/results.json` is a copy of the public file for the tests only; the page never reads it. Refresh it
when the site's file changes shape.

## Submit a reader

Open an [issue](https://github.com/HeOCR/heocr-leaderboard/issues/new?template=submission.yml) or a pull request
with your reader's name, version and licence, and its plain-text output for each document or page of the set you want
scored. HeOCR scores every submission itself with the public scorer and adds it to `results.json`; numbers computed
elsewhere are not posted. Submissions are run once the D-bench sets and their scorer are public; an issue opened
before then holds its place.

## Publish

Not published yet: the Space goes up after the release gate verdict, on the maintainer's word. When it does, push
this repository's files to a Hugging Face Space of type static under the HeOCR organisation. No secrets, sign-in or
gating are involved.

## Licence

Apache-2.0. The figures belong to `results.json` and carry the licences stated there.
