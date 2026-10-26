# Thêm một bộ test vào Starters Speaking

Mỗi bộ là một phần tử trong `data.json → sets[]`. Mẫu đầy đủ: bộ `ptp-t1` (Test 1). Quy trình cho MỖI bộ:

1. Lấy ảnh: tranh cảnh → `img/<id>/scene.webp` (chiều ngang khoảng 1500px); 8 ảnh thẻ (nền trắng) → `_work/raw/<id>/<tên>.png`.
2. `python3 _work/cutout.py <id>` tách nền thẻ → `img/<id>/<tên>.webp`.
3. Thêm bộ vào `data.json` (xem bên dưới).
4. `python3 _work/check_sets.py <id>` → sửa hết LỖI, MỞ ẢNH `_work/check/<id>.png` xem khung xanh/hồng có nằm đúng vật không.
5. `python3 _work/build.py` → tạo `speaking.html`. Xoá bộ đó khỏi `soon[]` và bổ sung vào `sets[]`.

## Các trường của một bộ
- `id` (vd `ptp-t2`), `no` (số thứ tự hiển thị, không trùng), `group`, `title` ("Test 2"), `theme`/`themeVi` (chủ đề).
- `origin`: `"book"` nếu nội dung lấy từ sách; `"claude"` nếu do Claude soạn. `src`: ghi rõ sách, test, số trang (KHÔNG bịa số trang).
- `scene`: `{img, alt}`.
- `hot`: vật trên tranh mà giám khảo chỉ/hỏi: `{ "car": {rect:[x,y,w,h], label:"car"} }`. Toạ độ tính theo % của tranh (0–100).
- `zones`: vùng đặt thẻ (Part 1): `{ "bicycle": {rect, label, at?:[x,y], tol?} }`. `at` = điểm thẻ nằm xuống (mặc định giữa vùng); vùng phải bám sát vật được nhắc, KHÔNG bao trùm người/vật khác.
- `cards`: `{ "guitar": {w:"guitar", img:"img/<id>/guitar.webp", s:"It's a guitar.", gen:true} }` (`gen:true` nếu câu mẫu do Claude soạn).
- `p1`: `hello`, `intro`, `example` (có `target`), `find[]` (say, back, vi, target, hints), `tableSay`, `order[]` (thứ tự thẻ trên bàn), `cardSteps[]` (mỗi thẻ: `pick`, tuỳ chọn `demo`, `place` với `zone`).
- `p2[]`: câu hỏi nhìn tranh (`point` = khoá trong `hot`, `say`, `ans[]`, `back`, `vi`, `hints[]`).
- `p3[]`: mỗi thẻ có `card` và `qs[]` (3 câu). Chỗ sách không rõ thì ghi vào `check` để cô xác nhận.
- `p4[]`: câu hỏi về em/bạn của em (`free:true` nếu không có đáp án cố định). `bye`: lời chào cuối.

## Quy tắc nội dung
- Chỉ chép từ sách những gì đọc được. Câu nào Claude tự soạn thì đánh dấu (`gen:true` hoặc `origin:"claude"`), không ghi là của sách.
- `hints[]` (nên 3 mức): (1) câu back-up của sách nếu có, hoặc câu Yes/No dễ hơn; (2) câu lựa chọn "A or B?"; (3) câu mẫu để em nói theo. Từ vựng đơn giản, câu ngắn.
- Ảnh/phần nào mờ, thiếu hoặc không chắc: ghi vào `check` và hỏi cô, không đoán.
