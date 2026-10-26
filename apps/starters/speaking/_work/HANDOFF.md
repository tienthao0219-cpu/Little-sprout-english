# Handoff – Starters Speaking (bản xem trước 1 bộ) · nhánh `starters-speaking-preview`

Cô Thanh Thảo (trả lời tiếng Việt; nội dung bài tiếng Anh; không có nhận giọng/phát âm; không tự bịa nội dung sách: phần Claude soạn phải gắn nhãn "do Claude soạn").

## Cấu trúc
- `apps/starters/speaking/speaking.html` được SINH RA từ `_work/template.html` + `_work/data.json` bằng `python3 build.py`.
- `python3 build.py --inline OUT.html` nhúng ảnh base64 thành 1 file duy nhất (để xem trước / Artifact).
- Ảnh bộ: `img/<id>/scene.webp` + `<card>.webp`. Local server: `python3 -m http.server 8765` từ thư mục gốc repo; trang ở `/apps/starters/speaking/speaking.html`.
- Test: `python3 pwtest.py [--shots]` (từ `_work`, cần server chạy) → laptop / iPad / điện thoại, 159 phép đo, 0 lỗi (lỗi tải Google Fonts trong sandbox được bỏ qua).

## Cấu trúc 1 bộ (theo Teacher's Guide Starters Speaking frame)
Part 1 (mint): chào + tên → giới thiệu tranh → ví dụ (cô chỉ) → "Where is…?" (chạm tranh) → 8 thẻ vật → chọn thẻ, cô đặt mẫu, em đặt thẻ (kéo hoặc chạm).
Part 2 (peach): cô chỉ vào tranh và hỏi.
Part 3 (sky): thẻ vật, chạm để lật (hình ↔ từ + câu mẫu).
Part 4 (rose): câu hỏi cá nhân. Xong 4 Part → 1 sao + sticker mốc.

## Lưu trữ
- localStorage `lss_prog_v1:<tên|guest>` (chỉ tên + tiến trình). Đọc tên từ `lse_auth_v1` (không đọc mật khẩu).
- Chưa sửa `Code.gs`; nếu muốn đồng bộ sao/sticker lên tài khoản → cần cô đồng ý.

## Chờ cô xác nhận
1. Giao diện bản xem trước (màu theo Part, chibi giám khảo, sao + sticker).
2. Thẻ `ball` (nhóm câu hỏi thứ 4 của Part 3) là suy luận: sách ghi 3 thẻ nhưng bảng có 4 nhóm.
3. Hotspot "cat" ở ví dụ Part 1 giả định là con mèo trắng.
4. Câu mẫu trên thẻ (It's a …) và lời chào "Miss Thao" do Claude soạn (`gen:true`).
5. Giọng đọc câu hỏi dùng `speechSynthesis` của trình duyệt (chỉ phát ra, không nhận giọng) – có nút tắt tiếng.
6. Bản nháp cũ trên Desktop (`speaking-sets.js` + `img/` của Claude) đã bị thay; thư mục tạm `~/Downloads/_claude_tmp_speaking/` cần cô xoá tay.
7. Repo công khai: ảnh trích từ sách có vấn đề bản quyền nếu để public – cô cân nhắc.

## Sau khi cô duyệt
Trích các bộ còn lại (PTP Test 2–5, Authentic 1–4, Get Ready, Mini Trainer, Collins Pre A1, Succeed…), bộ thiếu hình → file prompt tạo ảnh ChatGPT + khung placeholder; tổng 15–20 bộ.
