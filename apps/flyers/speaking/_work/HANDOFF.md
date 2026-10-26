# Handoff – Speaking test Flyers, Part 1 per-picture vocabulary (branch wip-speaking-part1-per-picture)

Teacher: Thanh Thảo (reply in Vietnamese; lesson content in English; detailed; include answers/instructions; no pronunciation features; don't invent textbook content).
App: `apps/flyers/speaking/speaking.html` is GENERATED: `_work/template.html` (placeholder `@@DATA@@`) + `_work/data.json` -> `python3 _work/build.py`.
Images: `apps/flyers/speaking/img/<id>/p1ex.webp`, `p1cand.webp`, etc. Local server: `python3 -m http.server 8765` from repo root; page at /apps/flyers/speaking/speaking.html.

## Feedback being implemented (17:26–17:41, 26 Oct 2026)
1. Part 1: two pictures differ (apple/orange tree, cow/sheep…) -> each picture needs its OWN vocabulary + dots. DONE (data).
2. "field" dot in col-t1 was misleading -> moved. DONE.
3. Vocabulary as 3-column table (position | picture 1 | picture 2) behind a curtain the teacher clicks to open. DONE in template (`vocabTable`), NOT yet tested in browser.
4. Part 2 hint: tap 1 = question words; tap 2 = structure e.g. "what / name"; clicking it shows model question(s) e.g. "What is the name of Harry's favourite restaurant? / What is the restaurant called?" Code written (`qitem` 3 steps, `qcue`, `qalts`), NOT yet verified.
5. Part 3 cards: prettier layout (`.pch` header, rows AI/Ở ĐÂU/LÀM GÌ/CẢM XÚC). Written, NOT yet verified visually.
6. Teacher said numbered difference markers are NOT needed ("không có số thứ tự cũng được"): numbers removed; pink dashed rings (.dring) now only show when 💡 hint is on.

## Data model (hot.p1 entries)
`[x,y,en,vi, ca]` ca: undefined/absent = same in both; `0` = only in examiner picture; `[en,vi,x,y]` = name/position in candidate picture; 6th elem `'ca'` = only in candidate picture (then x,y are candidate coords). `hotFor(q, side)` resolves per picture.
`ops.py` = per-set rename/absent/add rules (by dot index), `ops_pos.py` = manual position overrides, `apply_ca.py` rebuilds `data.json` from `data.before_ca.json` (+ `align0.json` template-matching shifts). Don't re-run it blindly if data.json was hand-edited afterwards.
I also fixed wrong dif text: col-t2 D1 (sun/cloud window), suc-t6 D7 (sausage vs chicken leg).

## TODO
- Run `_work/pwtest.py` (Playwright, all 40 sets x laptop/phone). NOTE: update its Part 2 check to click each `.qitem button` twice (step cycle) before counting `.qh`. Add checks: `.vcw` exists in Part 1, `.dring` count = dif count when hint on.
- Look at element screenshots: Part 1 (curtain closed/open, laptop + phone), Part 2 hint steps, Part 3 cards.
- Quick re-check dots for sets ai-t5..ai-t12 (contact sheets m16–m19 were not reviewed; others were).
- Commit, merge to main (`git push origin HEAD:main` after fetch), tell the teacher in Vietnamese to hard refresh (Ctrl+Shift+R).
- Commit trailer: Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
