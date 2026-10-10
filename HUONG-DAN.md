# Little Sprout English — hướng dẫn cài đặt (làm 1 lần, khoảng 30–40 phút)

Website gồm 2 phần ghép với nhau:
- **Phần giao diện** (các file trong thư mục này) đặt trên **GitHub Pages** — miễn phí.
- **Phần lưu dữ liệu** (lịch sử chơi, bài tập, điểm) nằm trong **Google Sheets** của cô, chạy bằng **Google Apps Script** — miễn phí.

Khoản $100 "Cloud session credits" chỉ dùng cho phiên làm việc với Claude, **không** dùng để trả hosting. Website này không cần trả tiền hosting.

> Lưu ý: tên nút và vị trí menu của GitHub/Google đôi khi đổi. Nếu cô không thấy đúng chữ ghi bên dưới, hãy tìm mục có ý nghĩa gần nhất hoặc gửi ảnh chụp cho mình.

---

## Bước 1. Đưa website lên GitHub
1. Đăng nhập GitHub → bấm **New repository**.
2. Đặt tên kho, ví dụ `little-sprout-english`. Chọn **Public**. Bấm **Create repository**.
   *(Kho Private muốn bật GitHub Pages thường cần gói trả phí; kho Public thì file app và bài tập ai có đường link đều mở được. Với lớp 1–1 thì thường chấp nhận được, nhưng cô nên biết điều này.)*
3. Trong kho mới, bấm **uploading an existing file** (hoặc **Add file → Upload files**), kéo **toàn bộ nội dung** của thư mục website vào (cả các thư mục `css`, `js`, `assets`, `data`, `apps`, `apps-script`, `docs` và file `index.html`, `.nojekyll`). Bấm **Commit changes**.

## Bước 2. Bật GitHub Pages
1. Trong kho: **Settings → Pages**.
2. Mục **Build and deployment → Source**: chọn **Deploy from a branch**; Branch: `main`, thư mục `/ (root)`; bấm **Save**.
3. Chờ 1–3 phút. Địa chỉ website sẽ là: `https://TEN-GITHUB.github.io/little-sprout-english/`

## Bước 3. Tạo nơi lưu dữ liệu (Google Sheets + Apps Script)
1. Vào Google Sheets, tạo bảng tính trống, đặt tên `Little Sprout – Dữ liệu`.
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code mẫu, mở file `apps-script/Code.gs`, copy toàn bộ rồi dán vào.
4. **Đổi 2 mật khẩu** ở đầu file: `STUDENT_PASSWORD` (mật khẩu chung cho học viên — cô muốn dễ nhớ thì đặt ngắn gọn) và `TEACHER_PASSWORD` (mật khẩu của cô, nên khác).
5. Bấm **Lưu**. Chọn hàm `thietLapLanDau` ở thanh trên rồi bấm **Chạy**. Google sẽ hỏi cấp quyền (truy cập Sheets và Drive của cô): cho phép. Việc này tạo sẵn các trang tính và một thư mục `LittleSprout_BaiTap` trong Drive để lưu bài tập.
6. Bấm **Triển khai → Tùy chọn triển khai mới**: loại **Ứng dụng web**; *Thực thi dưới tên*: **Tôi**; *Ai có quyền truy cập*: **Bất kỳ ai**. Bấm **Triển khai**, copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`).
7. Sau này nếu sửa `Code.gs`, phải **Triển khai → Quản lý triển khai → Sửa → Phiên bản mới** thì thay đổi mới có hiệu lực.

## Bước 4. Nối website với Google Sheets
1. Trong kho GitHub, mở file `js/config.js` → biểu tượng bút chì (Edit).
2. Dán URL ở bước 3 vào giữa hai dấu nháy của dòng `apiUrl: ""`.
3. Bấm **Commit changes**. Chờ 1–3 phút, tải lại website. Ô đăng nhập sẽ **không còn** dòng "chế độ DEMO".

## Bước 5. Cho phép đăng app ngay trên website (token GitHub)
Để nút **Đăng app** hoạt động, website cần quyền ghi vào kho của cô. Cô tạo một "chìa khoá" riêng, chỉ có quyền với đúng kho này:
1. GitHub → ảnh đại diện → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Đặt tên, chọn hạn dùng (ví dụ 1 năm). **Repository access: Only select repositories** → chọn kho `little-sprout-english`.
3. **Permissions → Repository permissions → Contents: Read and write**. Bấm **Generate token** và copy (chỉ hiện 1 lần).
4. Mở website → đăng nhập bằng mật khẩu giáo viên → **Khu của cô → Cài đặt**: dán token (tài khoản và tên kho thường tự nhận), bấm **Lưu & kiểm tra**.

Token chỉ lưu trong trình duyệt của cô trên máy đó. Đổi máy thì nhập lại. Không gửi token cho ai.

---

## Dùng hằng ngày
**Đăng app:** Khu của cô → *Đăng app* → chọn giáo trình, chọn hoặc tạo unit → chọn file HTML → *Đăng lên web*. Sau 1–3 phút học viên chơi được.
**Thêm unit / đổi tên / sắp xếp:** Khu của cô → *Giáo trình & unit*. Tên unit do cô tự đặt, website không có sẵn nội dung sách.
**Tạo bài tập:** *Bài tập → Tạo bài tập mới*. Mỗi bài có nhiều phần, mỗi phần chọn một dạng. Nhấn **🤖 Prompt cho AI** để lấy câu lệnh gửi ChatGPT/Gemini/NotebookLM, rồi dán kết quả vào ô nội dung. Có xem trước ngay, báo lỗi cú pháp theo từng câu.
**Xem báo cáo:** *Báo cáo học viên* → bấm tên học viên để xem chủ điểm sai nhiều, câu hay sai; có nút sao chép báo cáo.

## Học viên vào học
Gửi đường link website + mật khẩu lớp. Học viên nhập **tên** (nên thống nhất cách viết, ví dụ "Bin") + mật khẩu. Cùng một tên thì lịch sử gộp chung.

---

## Những điều cô nên biết (nói thật)
- **Mật khẩu chỉ bảo vệ việc lưu điểm và bài tập**, không "khoá" được file app: ai biết đường dẫn trực tiếp tới file HTML vẫn mở được (vì web tĩnh trên GitHub Pages công khai). Nội dung bài tập (đáp án) cũng được gửi về trình duyệt học viên để chấm, nên học viên rành kỹ thuật có thể xem được. Với lớp 1–1 thì thường ổn; nếu cần thi nghiêm túc thì không dùng cách này.
- **Báo câu sai chi tiết chỉ hoạt động với app có "báo kết quả".** App Countryside Hub (và các app cùng khuôn) được tự gắn. App khác chỉ ghi được "đã chơi lần mấy, bao lâu", trừ khi cô (hoặc mình) dán đoạn trong `docs/lse-report.js` vào app.
- Tiến trình riêng *bên trong* app (xu, trang bị…) vẫn lưu trên từng thiết bị theo cách app cũ, không theo tài khoản học viên.
- Chưa có dạng bài **Chọn vùng** và **Gắn nhãn** trên hình (cần công cụ vẽ vùng). Chưa có chỉnh từng câu bằng giao diện: cô sửa trực tiếp trong ô cú pháp rồi xem trước.
- **Không có kết nối trực tiếp với NotebookLM.** Cô copy nội dung/kết quả từ NotebookLM rồi dán vào.
- Phần Apps Script mình **chưa chạy thử trên tài khoản Google thật** (chỉ kiểm tra cú pháp; phần giao diện đã chạy thử với bộ nhớ giả lập). Lần đầu cài, cô thử nhanh: đăng nhập học viên → làm 1 bài → xem có dòng mới trong Google Sheets không. Nếu lỗi, gửi mình thông báo lỗi.
- Chế độ DEMO (khi chưa điền `apiUrl`): dữ liệu chỉ nằm trong trình duyệt đang dùng, mật khẩu thử là `sprout` (học viên) và `thao` (giáo viên).
