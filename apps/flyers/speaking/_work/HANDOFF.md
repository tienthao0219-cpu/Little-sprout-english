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

## Trạng thái (cập nhật 26 Oct 2026, phiên tiếp theo)
- `pwtest.py` đã cập nhật (Part 2: bấm mỗi `.qitem button` 2 lần rồi đếm `.qdet:not(.hidden) .qh`; thêm check `p1vcw`: có đúng 1 `.vcw`, có hàng từ vựng, số `.dring` hiển thị = 2 × số điểm khác khi bật 💡). Chạy từ thư mục `_work` (cần Playwright; Python bản 1.63.0 cùng bản với Chromium cài sẵn). Kết quả: 402 phép đo, 0 lỗi, không có lỗi console (40 bộ × laptop/điện thoại).
- Đã xem ảnh: Part 1 (màn che đóng/mở, vòng khoanh, laptop + điện thoại), Part 2 (3 bước gợi ý), Part 3 (thẻ).
- Part 1: ĐÃ XÓA phần "Từ vựng hai tranh" (màn che + bảng 3 cột). Dữ liệu từ vựng riêng từng tranh vẫn dùng cho chạm vào vật trong tranh.
- Đã rà lại chấm ai-t5…ai-t12 và sửa: ai-t6 mũ hồng chỉ có ở tranh cô; ai-t5 ba lô tranh em chuyển sang ghế; ai-t7 đổi nhãn "man (building)" → "man"; ai-t12 bao bột chỉ có ở tranh cô, mèo tranh em ở trên quầy. (Đã sửa cả `data.json` lẫn `ops.py`/`ops_pos.py`.)
- Part 2 (đã đổi theo đề xuất, cô Thảo đồng ý thử): mỗi câu có nút "❓ Câu N"; bấm 1 = từ hỏi + nghĩa, bấm 2 = cấu trúc (vd. what / buy), bấm 3 = câu hỏi mẫu tô màu + công thức + đáp án (+ "Cách hỏi khác"), bấm 4 = ẩn. Cô sẽ kiểm tra lại trên máy.
- Giao diện chung (CSS cuối `template.html`, khối "Giao diện chung"): 4 Part nằm một hàng; nút Phần trước/Phần tiếp dính đáy (`.nav.pnav`); thanh tiêu đề dính trên từ 700px; nút ≥ 40px, chữ ≥ 12px; hover chỉ cho chuột; safe-area iPhone/iPad; trang chủ 2 cột trên điện thoại. Quét tự động (tràn ngang / nút nhỏ / chữ nhỏ) ở 5 kích thước: điện thoại dọc + ngang, iPad dọc + ngang, laptop → sạch.
- Việc còn lại: cô hard refresh (Ctrl+Shift+R) sau khi bản mới lên.

## Cập nhật (phiên 3, theo góp ý của cô Thảo trên iPad)
- **Quy tắc chung của cô:** từ vựng cơ bản, dễ hiểu (học sinh trung bình); chữ tiếng Anh đứng TRƯỚC, tiếng Việt trong ngoặc, vd. "WHO (ai)".
- Part 1: bảng so sánh 2 tranh làm lại theo phong cách bảng mẫu cô gửi (khung pastel + bảng trắng bo tròn, header pastel, từ khác nhau tô màu/đậm; trên điện thoại xếp dọc). Code: `difTable` + `diffMark`, CSS "bảng so sánh hai tranh".
- Part 2: tiếng Anh dùng câu ngắn, dùng TÊN/"it" thay he/she, theo cách hỏi của Cambridge Flyers 3 Answer Booklet (Test 1/2/3: trang 11, 17, 23). `part2_simple.py` (chạy lại được): sửa cam3-t1/t2/t3 đúng sách ("What does she like painting?", "Was it cheap or expensive?", "Where is Emma's apartment?"); đơn giản hóa 9 bộ AI (ai-t2,3,4,5,8,9,10,11,12) cả bảng thông tin, câu hỏi của cô/em, từ vựng gợi ý; sửa lỗi tiêu đề "Zoe's a train trip"; ptp-t1..5 đổi he/she → đại từ đúng. Các bộ cam1/2/4, col, suc chưa có tên người trong dữ liệu nên vẫn dùng "he/she".
- Part 3: 5 cột pastel, mỗi cột một tranh; chạm cột để hiện lần lượt WHO → WHERE → ACTION → FEELING (đường kẻ mỏng giữa các dòng); từ nối (First, Then, Next, After that, Finally) nằm sẵn ở đầu cột; nút "Hiện tiếp / Hiện hết / Ẩn hết". Code: `p3cards` (`st.p3rev` giữ trạng thái).
- `vocab_simple.py`: thay 51 cụm khó trong gợi ý Part 3 (pleased, grateful, relieved, kneel, pavement, cabin…) bằng từ cơ bản; sửa vài câu chuyện mẫu.
- Thanh bar + nút home: `header.sbar` + `button.ni` (ô icon + nhãn) cùng phong cách website (nền kem mờ, logo tròn Miss Thảo `assets/chibi.png`, nút giống thanh menu). Nền trang và màu chữ đồng bộ với `css/style.css` của website.
- Chưa làm (cần cô quyết): Part 3 và Part 4 của các bộ cam3 vẫn là bản soạn thêm, chưa thay bằng kịch bản thật trong Answer Booklet (Test 1: "Vicky's strange day"/best friend; Test 2: "The goat and the coconuts"/school; Test 3: "A frog goes to school"/holidays).
