# 10 bộ test do Claude soạn (bộ 31–40), ảnh tạo bằng ChatGPT

Sách có 30 bộ; để đủ 40 cần 10 bộ thêm. Mỗi bộ cần **2 ảnh**: 1 tranh cảnh + 1 tấm 8 thẻ (nền trắng). Mọi nội dung đều đánh dấu `origin:"claude"`.

- `ai_specs.py` — đặc tả 10 bộ (cảnh gồm những gì, 8 thẻ, vật cần tìm, vùng đặt thẻ, câu hỏi Part 4). Chạy `python3 ai_specs.py` để sinh lại `prompts.json`.
- Prompt đưa cô Thảo: trang "Prompt ảnh Starters" (artifact có nút sao chép) và `prompts.json`.

## Quy trình khi cô gửi ảnh của một bộ (ví dụ ai-t1)
1. Lưu ảnh: `ai-t1-scene.png` (tranh), `ai-t1-cards.png` (tấm 8 thẻ).
2. Tranh: `python3 ai_sets/prep_scene.py ai-t1 ai-t1-scene.png` (cắt về 4:3, lưu `img/ai-t1/scene.webp`). Nếu báo cắt >10% mép thì nhờ cô tạo lại.
3. Thẻ: `python3 ai_sets/slice_sheet.py ai-t1 ai-t1-cards.png <8 khoá thẻ theo thứ tự>` (khoá lấy từ `ai_specs.py`, hàng trên trái→phải rồi hàng dưới), xem `_work/check/ai-t1-cards.png`; rồi `python3 _work/cutout.py ai-t1` để tách nền.
4. Toạ độ: `python3 ai_sets/grid_scene.py ai-t1` → xem `_work/check/ai-t1-grid.png`, đọc toạ độ % của các vật, ghi `ai_sets/coords/ai-t1.json` (định dạng ở đầu `gen_set.py`). Màu chính của mỗi thẻ ghi vào `colours`.
5. Đối chiếu tranh với đặc tả: số lượng (vd. đúng 3 quả bóng bay), màu, hành động. Tranh khác đặc tả thì sửa đặc tả/kịch bản cho khớp tranh, không ép tranh theo chữ.
6. `python3 ai_sets/gen_set.py ai-t1` → `python3 _work/check_sets.py ai-t1` (mở `_work/check/ai-t1.png` xem khung) → `python3 _work/build.py` → `node _work/handoff/tools/test_sets.js ai-t1` (cần server `python3 -m http.server 8765` ở gốc repo).
7. Commit + push.

## Tiến độ
- ai-t1 (Extra 1, At the zoo): XONG 27/10, đã kiểm thử.
- ai-t2 (Extra 2, On the farm): XONG 27/10, đã kiểm thử.
- ai-t3 (nhà bếp): CHƯA CÓ ẢNH (cô gửi ảnh nhưng không lưu được thành file; cần cô gửi lại).
- ai-t4 (Extra 4, In the bedroom): XONG 27/10, đã kiểm thử.
- ai-t7 (Extra 7, At the swimming pool): XONG 27/10, đã kiểm thử. (ai-t5, ai-t6 chờ cô gửi lại ảnh)
- ai-t9 (Extra 9, At the station): XONG 27/10, đã kiểm thử. cutout.py giờ bỏ mảnh vụn nhỏ của vật bên cạnh.
- Ảnh ChatGPT thường có NỀN TRONG SUỐT (kênh alpha): các công cụ đã tự ghép lên nền trắng.
