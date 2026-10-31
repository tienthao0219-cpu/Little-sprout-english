# BÀN GIAO: nhập Speaking Starters từ sách (nhánh `starters-speaking-books`)

Người dùng: cô Thanh Thảo (giáo viên tiếng Anh). Luôn trả lời cô bằng **tiếng Việt**, nội dung bài học bằng tiếng Anh, chi tiết, có đáp án/hướng dẫn.
Không bịa nội dung sách / số trang / chuẩn Cambridge. Chỗ nào Claude tự soạn thì gắn `gen:true` / `origin:"claude"`. Không chắc → ghi vào `check` và hỏi cô.
**KHÔNG merge vào main.** Commit/push vào `starters-speaking-books`. Commit kết thúc bằng 2 dòng:
`Co-Authored-By: Claude <noreply@anthropic.com>` (dùng đúng trailer mà phiên Code hiện tại yêu cầu).

## Cập nhật 31/10 (phiên cloud, đọc được ổ đĩa: `MI HAO HAO /MÌ HẢO HẢO/CAMBRIDGE/...`, tên ổ có dấu cách cuối, nhớ để trong ngoặc kép)
- XONG: auth3, auth4 (script Claude soạn), collins-t1..3, succ-t1..t8. Auth 2 đã dùng script sách (thay bản Claude).
- data.json có **37 bộ**: 28 bộ từ sách (ptp 5, auth1 3, auth2 3, auth3 3, auth4 3 [script Claude], collins 3, succ 8) + 9 bộ ảnh AI (ai-t1,2,3,4,6,7,8,9,10 = no 31–34, 36–40; thiếu ai-t5/no 35).
- no 21–22 dành cho Mini Trainer: CHƯA làm vì sách chỉ có scene + thẻ, KHÔNG có script giám khảo (test 2 ở pdf trang 40–42 của `MINI TESST/MINI START/pre_a1_starters_mini_trainer Đủ .pdf`). Cần cô quyết: soạn script kiểu auth4 (`origin:"claude"`) hay bỏ.
- Chưa xét: Pearson "YLE Practice Tests Plus Starter" (thư mục PRACTICE), Oxford Starters 4 test, Skills Builder Starters 1–2 → có thể thành no 41+ hoặc thay các bộ AI.
- Công cụ mới trong `tools/`: `collins_cards.py`, `t_collins.py`, `succ_scripts.py`, `succ_cards.py`, `t_succeed.py`, `test_sets.js` (chạy: `cd _work && NODE_PATH=$(npm root -g) node handoff/tools/test_sets.js <id...>`, cần `python3 -m http.server 8765` ở gốc repo).
- Succeed: thẻ `computer`, `shell` là hình chữ nhật bo góc (cutout hỏng). Collins gộp Part 1+2 vào Part 1 của app.

## Mục tiêu
~40 bộ Speaking. Sách đã nhập 28 bộ (+9 bộ AI = 37); Mini Trainer (2 bộ) chưa có script (cần báo cô ở cuối, và đề xuất tạo thêm bộ do Claude soạn, `origin:"claude"`, kèm image prompt).

## Tiến độ (bảng cũ; xem mục Cập nhật 31/10 ở trên cho trạng thái mới nhất)
| no | id | trạng thái |
|---|---|---|
| 1–5 | ptp-t1..t5 | XONG (có cảnh báo `check` cô cần xác nhận, xem dưới) |
| 6–8 | auth1-t1..t3 | XONG |
| 9–11 | auth2-t1..t3 | **XONG** (27/10). Ảnh từ Student's Book; script do Claude soạn vì lúc đó chưa có trang Answer Booklet (origin "claude"). **Việc còn lại:** khi có `starters_2_..._answer_booklet.pdf` (trang 10–11, 15–16, 20–21) thì thay script bằng bản của sách và đổi `origin` về `"book"` (sửa `tools/t_auth2.py`). |
| 12–14 | auth3-t1..t3 | chưa làm |
| 15–17 | auth4-t1..t3 | chưa làm (sách "Starters 4.pdf" không có answer booklet → script do Claude soạn theo khung chuẩn, `origin:"claude"`) |
| 18–20 | collins-t1..t3 | chưa làm |
| 21–22 | mini-t1..t2 | chưa làm |
| 23–30 | succeed-t1..t8 | chưa làm |
Loại trừ: "Get Ready for Starters" (không phải đề thi), YLE Practice Tests Plus (chưa xét; hỏi cô nếu muốn đưa vào để đủ 40).

## Nguồn sách (ổ "MI HAO HAO ^^" › MÌ HẢO HẢO › STARTERS; đường dẫn thiết bị `~/mnt/Volumes/MI HAO HAO ^^/MÌ HẢO HẢO/STARTERS`)
- AUTH/1: `starters 1 students book 2018.pdf`, `starters 1 answer booklet 2018.pdf`
- AUTH/2: `starters_2_authentic_examination_papers_student_s_book.pdf` + `..._answer_booklet.pdf`
- AUTH/3: `Starters 3 2019.pdf` + `Starters 3 answer booklet 2019.pdf`
- AUTH/4: `Starters 4.pdf` (SB: speaking p47, p51, p55, mỗi trang kèm trang OBJECT CARDS; không có answer booklet)
- PRE/A1 Starters Collins: `Pre A1 Starters.pdf` (Test1 speaking p23–25, Test2 p41–43, Test3 p59–61 + OBJECT CARDS), `Pre A1 Starters - answer key.pdf` (script trang 10–12, 16–18, 22–24, "Parts 1–5": gộp Part 1+2 thành Part 1 của app)
- MINI TESST/MINI START: `starters_mini_trainer.pdf`/`pre_a1_starters_mini_trainer Đủ .pdf` (scan, test ở trang 25 và 41), `..._answer_keys.pdf` (có text layer)
- SUCCEED: `SUCCEED STARTERS 2018 (IN 95%).pdf` (Practice Test ở trang 5/23/41/59/77/95/113/131), `succeed in starters key..pdf` (đáp án/script trang 19–26)
- PTP (Practice Tests Plus) đã xong.
Công cụ trên máy cô: `pdftotext`, `pdftoppm`, `tesseract` (đặt `OMP_THREAD_LIMIT=1` khi chạy song song). PDF scan cần OCR. Render trang bằng `pdftoppm -r 150 -png -f N -l N`.
AUTH 1/2 (scan màu): trang answer-booklet speaking nằm ở các trang PDF 10–11, 15–16, 20–21. Trang scene trong SB bị **xoay 90°**, cần xoay 90° theo chiều kim đồng hồ.

## Quy trình mỗi bộ (đã dùng cho 8 bộ trước)
1. Cắt scene → `img/<id>/scene.webp` rộng 1500px (`tools/colorcrop.py: crop_scene(page,out,box=None)`; nếu tự dò khung sai thì truyền `box=(x0,y0,x1,y1)` toạ độ trang gốc. AUTH2-T1 phải dùng tay `box=(198,290,1056,1538)`). Ảnh lưới 10% sinh ra ở `/tmp/grids/<id>.png` để đọc toạ độ %.
2. Cắt 8 thẻ → `_work/raw/<id>/<tên>.png`.
   - Thẻ nền clipart trắng (PTP): `python3 _work/cutout.py <id>`.
   - Thẻ nền màu (Authentic/Collins…): KHÔNG cutout; `tools/rawcard.py <id>` (bo góc, webp 400px) → `img/<id>/<tên>.webp`.
3. Đối chiếu script giám khảo (Part 1–4, back-up, đáp án) bằng cách **xem ảnh trang answer booklet**, không tin OCR 100%.
4. Viết bộ bằng `tools/sethelp.py` (xem `t_auth1.py`, `t_ptp45.py` làm mẫu) rồi `add(d,s)` (tự sort theo `no`, xoá `soon`).
5. `python3 _work/check_sets.py <id>` → sửa hết LỖI; mở `_work/check/<id>.png` xem khung xanh (vật) / hồng (vùng đặt thẻ) đúng chỗ, vùng đặt thẻ không đè người/vật khác.
6. Cuối cùng: `python3 _work/build.py`, test Playwright (`_work/pwtest.py`, server `python3 -m http.server 8765` ở gốc repo), commit, push.

## AUTH 2: việc cần làm tiếp (đã chuẩn bị sẵn)
- Thẻ (tên file = key): T1 zebra pen guitar burger crayons trousers cap elephant · T2 bee kite frog tshirt bike ball skateboard meatballs · T3 seagull jellyfish racket pencil hat chips camera phone. (Thẻ T3 "seagull": ảnh trông giống hải âu/chim; xác nhận theo script.)
- Scene: T1 lớp học (cửa sổ có 2 người, bóng chuyền, bé trai ngủ, radio, ba lô đỏ + ba lô xanh lá, 2 quả chuối, đồng hồ, bảng, cô/thầy ở cửa); T2 phố (shop, tàu, máy bay, trực thăng, cây, chó, bé chạy, xe, xe tải, nhà); T3 bãi biển (hải đăng, bé câu cá, bé gái đọc sách trên ghế, thuyền, xe, vỏ sò, đá). Ảnh lưới: `_work/handoff/auth2-t*.png`, montage thẻ: `_work/handoff/m_auth2_t*.png`.
- Script: xem ảnh answer booklet (render lại từ `starters_2_..._answer_booklet.pdf` trang 10–11, 15–16, 20–21). Tên `src` mẫu: "Authentic Examination Papers Starters 2 · Answer Booklet Test N, Speaking · hình: Student's Book Test N Speaking". Không bịa số trang.
- `no` 9–11, `group:"auth2"`, title "Authentic 2 · Test N".

## Quy ước nội dung đã chốt (giữ nhất quán)
- Lỗi chính tả trong câu back-up của sách được sửa kèm `note` (vd T4 flower "Is this the flower?").
- Lựa chọn "X / Y" trong sách → dùng 1 thẻ, kèm `note`.
- Part 4: "he / she" → "your friend" / "your mother", kèm `note`.
- Hints 2 mức cho mọi câu: (1) back-up của sách hoặc Yes/No dễ hơn; (2) "A or B?". Không lộ đáp án.
- Lời chào `HELLO` do Claude soạn (`gen:true`). Tiêu đề phải ngắn, duy nhất (hiện trên ô trang chủ).
- Không có nhận diện giọng / phát âm; âm thanh có nút tắt tiếng. Lưu tiến độ chỉ bằng localStorage; không sửa `Code.gs` nếu chưa hỏi cô.
- Repo công khai và chứa ảnh sách → nhắc cô.

## Mục cần hỏi/nhắc cô khi báo cáo cuối
1. ptp-t5: ví dụ "This is a bag" đang gắn vào cái giỏ (basket) — cần cô xác nhận (`check`).
2. ptp-t1: thẻ Part 3 "ball" do suy ra; câu "Take three object cards" nhưng bảng có 4 nhóm (`check`).
3. Thẻ nền màu không cắt nền (giữ ô vuông màu).
4. AUTH 4 không có script sách → do Claude soạn.
5. Collins có 5 part → gộp Part 1+2 vào 4 part của app.
6. Get Ready bị loại.
7. Thư mục tạm trên máy cô `Downloads/_claude_tmp_speaking`, `_claude_tmp_speaking2`, `_claude_tmp_speaking3` cần cô tự xoá.
8. Âm thanh "nghẹt": đã sửa (resume AudioContext, trễ 90ms sau cancel, giữ tham chiếu utterance); chưa được cô xác nhận trên thiết bị.
9. Kết quả cuối: số bộ nhập từ sách / còn thiếu so với 40.
10. Mục `check` còn mở: succ-t2 (cô tóc nâu, vùng cửa), succ-t6 (quả táo nhỏ), vùng đặt thẻ xấp xỉ ở succ-t4 (lorry/motorbike, table), succ-t5 (behind), succ-t6 (in front of), succ-t7 (dresses, lorry); Collins: lỗi chính tả back-up football ("Is it a television?") và jacket ("Is it a bike?"), vùng "behind the chair"/"behind the young boy"; auth2-t3 "white boat".
