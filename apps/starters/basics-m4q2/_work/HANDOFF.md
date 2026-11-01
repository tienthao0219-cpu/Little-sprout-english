# ABC · 123 · Colours (Starters) – bàn giao
4 bộ flashcard trong unit "ABC · 123 · COLOURS" của lớp Starters: `alphabet.html` (26), `numbers-1-20.html` (20), `numbers-21-100.html` (80), `colours.html` (12).
Mỗi thẻ: hình + từ (tiếng Anh) + nghĩa tiếng Việt + âm thanh (giọng đọc của trình duyệt – speechSynthesis – giống các bộ Picture cards cũ). Có 3 chế độ: 🃏 Thẻ từ (lưới), 📖 Học thẻ (từng thẻ), 🎯 Luyện tập.

## Làm lại ảnh / bộ thẻ
- Ảnh gốc cô Thảo gửi (4 bảng) nằm ở `_work/sheets/*.webp`. `python3 build_images.py` tách từng thẻ → `img/{alphabet,numbers,colours}/*.webp` (mất ~4 phút).
- BẢNG 21–100 CỦA CÔ BỊ LỖI: ô thứ 3 hàng 1 ghi "22" (đúng ra 23), ô thứ 5 hàng 4 ghi "56" (đúng ra 55), thiếu 29, 38, 46, 58, 67, 79, 89 → 9 số **vẽ bù** bằng `gen_tiles.py` (cùng kiểu mây cầu vồng, danh sách trong `img/_generated.json`). Muốn thay bằng ảnh thật: chép đè `img/numbers/<số>.webp` (rộng ~400px, nền trong suốt).
- Chữ cái đọc bằng cách đọc tên (ay, bee, see…, `LSAY` trong `build_decks.py`), IPA ở thẻ mặt sau. Tên màu "light green", "light blue" là theo hình cô gửi.
- `python3 build_decks.py` dựng lại 4 file html từ `_work/deck-template.html` (bản sao khuôn Picture cards) + dữ liệu thẻ trong script.

## Chế độ "📖 Học thẻ" (dùng chung)
Nguồn: `apps/starters/_tools/learn.{css,js}`; `python3 apps/starters/_tools/add_learn_mode.py` gắn/cập nhật vào MỌI app Picture cards / "Thẻ từ vựng" (27 file Starters + Flyers; chạy lại nhiều lần được). Mặt trước = hình, chạm để lật → từ + nghĩa + 🔊; có Trước / Tiếp / Xáo trộn, phím ← → Space, vuốt trái/phải, lọc chủ đề, "Tự đọc" khi lật (nhớ trong máy), màn hoàn thành.
