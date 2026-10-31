# Flyers Grammar (Get Ready for Flyers) – bàn giao
Cô Thảo: học sinh tiểu học trung bình/yếu → ĐƠN GIẢN, hình dễ thương, chữ tiếng Anh trước + tiếng Việt, từ vựng cơ bản. KHÔNG tự bịa nội dung sách: chủ điểm ngữ pháp từng unit do cô gửi (xem `units.md` bên dưới).

## Cập nhật v2 (theo góp ý của cô Thảo)
- Mỗi bài ngữ pháp gồm các KHỐI (`lesson.blocks[]`, thứ tự hiển thị): `when` (khi nào dùng, có ví dụ), `grid` (thẻ nhỏ: 6 giới từ / nghĩa của can), `table` (bảng nhóm, vd 4 nhóm × người/vật/nơi), `steps` (các bước chọn từ), `pattern` (công thức MỖI PHẦN MỘT MÀU + ví dụ tô cùng màu, có ảnh), `dialog` (chibi hỏi – chibi đáp, công thức câu hỏi), `cards` (hình ví dụ), `mistakes` (✘ sai / ✔ đúng / vì sao), `tip2` (mẹo 1 dòng), `acts` (luyện nhanh kéo thả).
- Luyện nhanh (`U.acts`): `bucket` = kéo chữ/hình vào nhóm; `slot` = kéo chữ vào chỗ trống dưới hình/câu. Kéo bằng ngón tay/chuột hoặc chạm chữ rồi chạm đích (điện thoại). Làm xong tất cả hoạt động của bài thì mở nút "Luyện tập".
- Luyện tập mỗi bài 20 câu (`lesson.practice[]`: 10 `mcq` + 10 `fill` điền từ, có "gợi ý chữ"); câu sai quay lại (Fix it, tối đa 3 vòng); xong thì mới mở bài sau; bài tập tổng hợp 10 câu mở sau 4 bài.
- Màu thành phần câu: sub=xanh lá, aux=xanh dương, pre=cam, obj=tím, v=vàng, pink=hồng (are / can't).
- `data.json` là nguồn chính. Các script `lessons_u1.py`, `lessons_u1_b.py`, `practice_u1.py` là lịch sử soạn nội dung Unit 1 (không chạy lại độc lập, vì chúng sửa tiếp data.json).

## Cập nhật v3 (góp ý ảnh chụp của cô Thảo)
- Bảng pastel nhiều màu: khối `table` có `tint:[màu cột 1,2,3]` (peach/sky/mint/rose/lav/butter), `big0:true` cho cột đầu chữ lớn. Bài đại từ: "Khi nào dùng" và "Chọn từ nào" đều là bảng.
- "Đừng nhầm" (`mistakes`): hai nửa ✘ Sai (hồng) | ✔ Đúng (xanh) + dòng 💡 giải thích.
- Icon riêng cho từng bài (`GIC` trong template: l1..l4, q + undo/skip/next/home); thẻ bài ở trang Unit có dải màu, icon trong vòng trắng, 3 chip tiến độ Học / Luyện / n câu.
- Màn luyện tập có thanh nút dưới: Undo (xoá chữ đang gõ hoặc về câu trước) · Skip (đưa câu xuống cuối) · Next (mở sau khi trả lời) · Home (về trang ngữ pháp, hỏi xác nhận nếu đã làm dở).
- `gtest.py` kiểm tra cả thanh nút.

## Cập nhật v4 (trang tổng + luyện trộn)
- MỘT file duy nhất `apps/flyers/grammar/grammar-flyers.html` (build.py nhúng toàn bộ `data.json`). Trang đầu = 12 unit (`data.meta[]`: tên, chủ điểm của cô; `ready:true` khi unit đã có nội dung trong `units[]`). Mỗi unit có ô tick ☑ → thanh "Luyện tập trộn": chọn Dễ / Trung bình / Khó và 10/15/20 câu → bài trộn từ kho `unit.mix` (80 câu dạng Cambridge: look / read / dlg / cloze / list / fill, có `lv` e·m·h) + `unit.quiz`. Câu thiếu mức dễ thì lấy mức gần nhất.
- Câu điền từ trong luyện tập: không hiện sẵn chữ gợi ý; có nút 💡 Gợi ý (1: chữ cái đầu + số chữ; 2: hiện word bank). Dạng `list` thì hiện sẵn word list như đề Cambridge. Hội thoại/đoạn ngắn: `pre`/`post` của câu hỏi.
- `practice_u1_v2.py` chỉ tạo kho `mix`; `practice_u1.py` tạo 20 câu luyện tập từng bài (cô đã duyệt, giữ nguyên).
- Thêm unit mới: thêm vào `units[]` (lessons[].blocks/practice, quiz, mix, acts, vocabDir) + đặt `ready` tự động theo `units[]`; chạy `build.py`, `gtest.py <số unit>`.

## Cấu trúc
- `_work/data.json`: `units[]` – mỗi unit: `lessons[]` (title, vi, color, icon, say, formula, cards[{art,en,vi}], tip) + `quiz[]` (10 câu 3 đáp án: q có `___`, opts, a, why, art?).
- `_work/template.html` + `python3 _work/build.py` → `apps/flyers/grammar/grammar-<unit>.html` (mỗi unit một file; build cũng cập nhật `updated` trong data/manifest.json).
- `_work/gtest.py <unit-1>`: kiểm tra tự động (khoá, 4 bài, ảnh, bài tập, vòng "Fix it", báo LSE) – cần `python3 -m http.server 8765` ở gốc repo + Playwright.
- Hình: mèo/nhân vật lấy từ `kawaii()` của Starters Speaking (build chép tự động), ảnh từ vựng `data/wordsets/img/<vocabDir>/<từ>.webp`, art `prep` (mèo + bàn/hộp/sofa), `people`/`thing`, `vocab` (ảnh lặp n lần, `no`=gạch chéo, `q`=dấu ?).
- Khoá: bài i mở sau khi bấm "Em đã hiểu" bài i-1; bài tập mở sau 4 bài. Tài khoản không phải học viên (hoặc `?teach=1`) mở hết. Tiến độ lưu localStorage `lse_grammar_flyers:<unit>:<tên>`.
- Bài tập: câu sai quay lại (tối đa 3 vòng) tới khi đúng; điểm = số câu đúng ngay lần đầu; 1–3 sao; báo `LSE_REPORT.answer/finish` về website.

## Chủ điểm ngữ pháp 12 unit (do cô Thảo cung cấp)
1 Our home: prepositions of place; indefinite pronouns; there is/are; can · 2 Going to town: imperatives; could (suggestions); prepositions of place & movement; can/could/will (requests) · 3 Eating out: will (offers); conditional/result clauses (When/If) · 4 At school: imperatives; could/couldn't (past ability); question words, What time · 5 A day out: present simple & continuous (future); could/shall/let's; going to; relative clauses which/that/where; verbs + indirect objects · 6 Dream jobs: I'd like/wouldn't like; like/love/hate + -ing; Where questions; could (possibility) · 7 At the castle: will vs going to; past simple · 8 Sports day!: present continuous (future); going to; tag questions; present perfect + already · 9 Our camping adventure: should/shouldn't; past simple & past continuous; present perfect · 10 A good year!: -ing forms; if clauses · 11 Our summer holidays: future simple; should/might/can't; imperatives & going to; present perfect (regular & irregular) · 12 Past and future: past simple vs present perfect; will & might.
(Danh sách cô gửi có dấu trích dẫn [1][2] như copy từ công cụ AI – cô nên đối chiếu lại với sách khi duyệt.)

## Việc còn lại
- Unit 1 = bản MẪU chờ cô duyệt; sau đó làm Unit 2–12 cùng khuôn (thêm vào data.json + thêm app vào data/manifest.json, unit `grammar` trong lớp flyers).
- Dữ liệu hiện nằm trong data.json (chưa đọc từ Google Sheets). Chưa có âm thanh hiệu ứng.
