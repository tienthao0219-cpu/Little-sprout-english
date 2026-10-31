# BÀN GIAO – Movers Speaking (nhánh `movers-speaking`)

Cô Thanh Thảo (giáo viên tiếng Anh). Trả lời cô bằng **tiếng Việt**, nội dung bài học bằng tiếng Anh (tiếng Anh trước, tiếng Việt trong ngoặc), chi tiết, có đáp án/hướng dẫn.
Không bịa nội dung sách/số trang/chuẩn Cambridge: chỗ nào Claude tự soạn thì ghi `note` / `origin:'claude'` và nói rõ cho cô. **KHÔNG merge vào `main`**; cô duyệt trước.

## Trạng thái (31/10/2026)
- App: `apps/movers/speaking/speaking.html` (SINH RA từ `_work/template.html` + `_work/sets/*.py` bằng `python3 _work/build.py`; build cũng đăng ký app vào `data/manifest.json`, thêm mục "Cambridge Movers" › SPEAKING vì trước đó site chưa có folder Movers).
- **28 bộ hiển thị** (kiểm thử `_work/pwtest.py`: 448 phép đo, 0 lỗi): Practice Tests Plus 1–5 · Authentic 1–4 (12 bộ) · Collins 1–3 · Succeed 1–8.
- **12 bộ AI (ai-t1…ai-t12)**: đã soạn đủ nội dung + prompt ảnh (`ai_sets/PROMPTS-movers-ai.md`), đang ẨN chờ cô tạo ảnh bằng ChatGPT. Khi cô gửi ảnh: `python3 _work/ai_sets/import_ai.py ai-tN <thư mục ảnh>` → xem lưới `tools/gridpair.py ai-tN` → ghi vòng khoanh Part 1 vào `sets/_crop/ai-tN.json` khoá `"dif"` → `build.py` → `pwtest.py`. Đủ 40 bộ khi có cả 12.
- Chưa làm: **Mini Trainer** (2 bộ, tranh dạng tô màu, Part 3 khác cấu trúc), Oxford CEQ (chỉ có ghi chú giáo viên, không có hình), Skills Builder/Get Ready/Fun for Movers.

## Cấu trúc Movers (khác Flyers – đã xác nhận bằng Handbook 2024)
Part 1 Find the Differences (2 tranh; app đặt song song, trái = tranh cô) · Part 2 Picture Story (dải 4 tranh; có "Xem từng tranh") · Part 3 Odd One Out (4 bộ × 4 tranh; bộ 1 cô làm mẫu; mỗi hàng = 1 bộ; chạm chọn + kiểm tra) · Part 4 câu hỏi cá nhân.
Template dựa trên Flyers tại commit e1e4fba; `main` sau đó có thêm (đồng bộ sao/sticker lên profile, mã cô…) – chưa chuyển sang Movers.

## Dữ liệu mỗi bộ (`sets/_common.py: S2`)
`teacher.p1` (ví dụ + 4 mục ex/cand/back) · `dif` (vòng khoanh [x,y,w,h] chuẩn hoá, `b2` = vòng riêng trên tranh em) · `teacher.p2` (tên truyện, câu mở, câu kể + câu hỏi gợi ý) · `teacher.p3.sets` (tranh khác loại 1–4, lý do mẫu, gợi ý) · `p4` · `hints` (từ vựng) · `p2box` (tự ghi từ `sets/_crop/<id>.json`) · `note`/`origin`.

## Công cụ ảnh (`tools/`)
`crop_set.py <id> <pdf> <trang P1> <P2> <P3> [--rot -90] [--rot1 N] [--margin 0.02] [--swap1]` (trang sách in xoay 90°; sau xoay tranh cô ở bên TRÁI; Succeed 1–6 in thẳng nên dùng `--rot1 0`; dò khung tự động, chịu nền scan nhiễu) · `qa_set.py` (ảnh kiểm tra: lưới 10% + các hàng Part 3) · `gridpair.py` · `diffbox.py` (dò điểm khác tự động – không đủ tin cậy, chỉ tham khảo).
PDF nguồn nằm trong ổ "MI HAO HAO " (có dấu cách cuối tên) › MÌ HẢO HẢO › CAMBRIDGE › MOVERS. Cần cấp quyền thư mục `/Volumes` rồi `device_stage_files`.

## Lưu ý nội dung
- Authentic 4 và các bộ AI: sách không có script Speaking / không phải đề sách → Claude soạn, gắn nhãn; cô cần kiểm tra.
- Part 1 và Part 3 của nhiều sách chỉ liệt kê điểm khác / câu hỏi gợi ý; câu mẫu ex/cand và lý do mẫu do Claude viết theo đó (ghi trong `note`).
- Vòng khoanh Part 1 ước lượng từ ảnh lưới 10% → có thể lệch vài %, cô báo thì chỉnh trong `sets/*.py`.
