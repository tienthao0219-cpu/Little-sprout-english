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
**Cách 1 – mật khẩu lớp chung** (khi chưa có học viên nào trong tab *Học viên*): gửi đường link + mật khẩu lớp. Học viên nhập tên + mật khẩu. Cùng một tên thì lịch sử gộp chung, và em này có thể gõ tên em kia để xem.

**Cách 2 – mỗi em một mật khẩu riêng** (khuyên dùng): Khu của cô → *👥 Học viên* → dán danh sách tên, trang tự tạo mật khẩu 5 ký tự cho từng em → bấm *Sao chép tên + mật khẩu* để gửi riêng cho từng em/phụ huynh. Khi có ít nhất 1 học viên đang hoạt động trong danh sách, **mật khẩu lớp chung ngừng dùng được**. Em nào chỉ xem được lịch sử, điểm của chính em đó (tên được lấy từ danh sách chứ không tin tên trình duyệt gửi).

**Giao riêng:** ở bài tập có dòng *Giao cho → Chọn học viên…*; ở tab *Giáo trình & unit* mỗi app có nút *👥*. Không chọn ai = tất cả đều thấy. Với bài tập, máy chủ chặn thật (em không được giao thì không mở, không nộp được). Với app, chỉ **ẩn khỏi danh sách** (xem mục "nói thật").

---

## Những điều cô nên biết (nói thật)
- **Giao app riêng cho từng em chỉ là ẩn trên giao diện**, không phải khoá kín: file app nằm trong kho công khai, ai biết đường dẫn trực tiếp vẫn mở được. Còn lịch sử/điểm của từng em và việc giao *bài tập* thì được máy chủ kiểm tra thật.
- **Đừng đưa thông tin riêng của học viên (điểm cá nhân, nhận xét, liên lạc) vào kho GitHub** vì kho đang công khai. Tên và mật khẩu học viên chỉ nằm trong Google Sheet của cô (trang tính `students`), không nằm trong kho.
- **Mật khẩu chỉ bảo vệ việc lưu điểm và bài tập**, không "khoá" được file app: ai biết đường dẫn trực tiếp tới file HTML vẫn mở được (vì web tĩnh trên GitHub Pages công khai). Nội dung bài tập (đáp án) cũng được gửi về trình duyệt học viên để chấm, nên học viên rành kỹ thuật có thể xem được. Với lớp 1–1 thì thường ổn; nếu cần thi nghiêm túc thì không dùng cách này.
- **Báo câu sai chi tiết chỉ hoạt động với app có "báo kết quả".** App Countryside Hub (và các app cùng khuôn) được tự gắn. App khác chỉ ghi được "đã chơi lần mấy, bao lâu", trừ khi cô (hoặc mình) dán đoạn trong `docs/lse-report.js` vào app.
- Tiến trình riêng *bên trong* app (xu, trang bị…) vẫn lưu trên từng thiết bị theo cách app cũ, không theo tài khoản học viên.
- Chưa có dạng bài **Chọn vùng** và **Gắn nhãn** trên hình (cần công cụ vẽ vùng). Chưa có chỉnh từng câu bằng giao diện: cô sửa trực tiếp trong ô cú pháp rồi xem trước.
- **Không có kết nối trực tiếp với NotebookLM.** Cô copy nội dung/kết quả từ NotebookLM rồi dán vào.
- Phần Apps Script mình **chưa chạy thử trên tài khoản Google thật** (chỉ kiểm tra cú pháp; phần giao diện đã chạy thử với bộ nhớ giả lập). Lần đầu cài, cô thử nhanh: đăng nhập học viên → làm 1 bài → xem có dòng mới trong Google Sheets không. Nếu lỗi, gửi mình thông báo lỗi.
- Chế độ DEMO (khi chưa điền `apiUrl`): dữ liệu chỉ nằm trong trình duyệt đang dùng, mật khẩu thử là `sprout` (học viên) và `thao` (giáo viên).


## Hình cho từng từ / câu (đợt 1)
- Trong khung soạn bài, thêm dòng `IMG: ...` ngay trước câu. Sau `IMG:` có thể là emoji (`IMG: 🍎`), tên từ đã tải ở tab **🖼️ Hình** (`IMG: apple`) hoặc đường dẫn ảnh.
- Dạng ghép cặp: vế trái viết `img:dog = con chó`.
- Nút **🪄 Gợi ý hình** tự gắn emoji cho các câu có danh từ cụ thể/màu sắc; cô xem lại và xoá dòng chưa đúng.
- Tab **🖼️ Hình**: tải nhiều ảnh cùng lúc, tên file = từ (dog.png → `dog`). Cần token GitHub ở tab Cài đặt.

## Ảnh sách → bài tập (miễn phí, đọc chữ ngay trên máy cô)
1. Khu của cô → **📝 Bài tập** → **📷 Tạo từ ảnh sách** (hoặc nút **📷 Tạo phần từ ảnh sách** khi đang soạn bài).
2. Chọn ảnh (xoay nếu nghiêng) → **Đọc chữ trong ảnh**. Lần đầu nạp 10–30 giây.
3. Sửa chữ bị đọc sai. Muốn bỏ trống từ nào thì bọc `[[từ]]`. Dòng `dog - con chó` dùng cho ghép cặp/trắc nghiệm.
4. Chọn dạng bài → **Tạo bài** → xem lại từng phần trong trang soạn bài rồi Lưu.
- Giới hạn: đọc tốt chữ in tiếng Anh, ảnh thẳng, đủ sáng. Chữ tiếng Việt có dấu (tick ô "có tiếng Việt") và chữ viết tay có thể sai. Đây là đọc chữ + dựng bài theo mẫu, không phải AI "hiểu" sách; luôn cần cô xem lại.

## 7 dạng bài trò chơi mới
| Dạng | Cú pháp 1 dòng |
|---|---|
| 🔊 Nghe chọn từ | `dog \| cat, bird, fish` (từ đầu là đáp án; bỏ phần sau \| thì tự lấy đáp án nhiễu) |
| 🎯 Nhìn nghĩa chọn từ | `con chó => dog \| cat, bird, fish` (thêm `IMG: 🐰` phía trên để hiện hình) |
| 🔤 Xếp chữ cái | `dog \| con chó` |
| 🃏 Lật thẻ ghép cặp | `dog = con chó` (ván cách nhau 1 dòng trống; `img:🍎 = apple`) |
| 🔎 Tìm từ trong bảng | mỗi dòng 1 từ hoặc `dog \| con chó` |
| 📰 Ô chữ | `apple \| a red fruit` (cần 3 từ trở lên, có chữ cái chung) |
| 🕵️ Thám tử bắt lỗi | `She [[go]] to school. => goes` |
- Nghe chọn từ dùng giọng đọc có sẵn của trình duyệt (miễn phí). Muốn dùng file MP3 riêng: thêm dòng `AUDIO: assets/media/ten.mp3` ngay trước dòng đó.
- Màu folder: 16 màu pastel, giáo trình mới tự lấy màu chưa dùng.

## Cập nhật đợt 2
- 🃏 Lật thẻ: cả phần là MỘT bàn thẻ (mỗi dòng một cặp, tối đa 15 cặp = 30 thẻ). Mẫu có 10 cặp hình–từ (20 thẻ).
- 🔎 Tìm từ: học sinh chọn mức Dễ / Vừa / Khó. Cô đặt mức mặc định bằng dòng `LEVEL: dễ` (hoặc vừa, khó).
- 🗂️ Phân loại: mặc định kéo thẻ vào cột của nhóm. Muốn kiểu bấm chọn nhóm cũ: ô "Cách làm (Phân loại)" trong phần bài.
- Thanh menu: cô hiện ảnh chibi, học sinh hiện chữ cái đầu của tên trên nền màu pastel.

## Cập nhật đợt 3
- ✍️ **Viết lại câu (đồng nghĩa)**: `câu gốc | bắt đầu bằng => đáp án 1 / đáp án 2`. Chấm không phân biệt hoa thường, bỏ dấu câu, coi isn't = is not, I'm = I am.
- 🎮 **Luyện tập** (nút trên mỗi bài tập): kiểm tra từng câu, có gợi ý (−2 xu), kiếm xu, chuỗi đúng liên tiếp, **Fix it!** làm lại các câu vừa sai. Không tính điểm vào báo cáo.
- 🪙 **Xu và cửa hàng avatar**: xu kiếm từ luyện tập và nộp bài; đổi avatar ở mục xu trên thanh menu. LƯU Ý: xu và avatar lưu trên từng thiết bị (trình duyệt) của học sinh, chưa đồng bộ giữa các máy.
- 🔊 Nút nghe từ ở trắc nghiệm, đúng/sai, trả lời ngắn, ghép cặp, lật thẻ, tìm từ. Muốn tắt trong một phần: tick "Ẩn các nút 🔊" ở phần bài.
- 🔈 Nút Âm thanh trên menu để bật/tắt tiếng hiệu ứng.

## Cập nhật đợt 4 (xu & avatar lưu Google Sheets, thú nuôi, nhiệm vụ, ôn lại, Boss, bản đồ, chủ đề, in phiếu, báo cáo phụ huynh)

### A. Cách cập nhật (làm 1 lần, đúng thứ tự — xem 3 hình `dot4-b1`, `dot4-b2`, `dot4-b3`)
1. **Dán Code.gs mới** vào Apps Script (xoá hết code cũ, dán file `apps-script/Code.gs`). Gõ lại 2 mật khẩu: dòng `DOI-MAT-KHAU-LOP` → mật khẩu lớp (ví dụ 123), `DOI-MAT-KHAU-CO` → mật khẩu cô (ví dụ 1909). Bấm Lưu.
2. **Triển khai → Quản lý bản triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.** (Không tạo triển khai mới để link /exec không đổi.)
3. **Up lên GitHub** (repo, thư mục gốc): `index.html`, thư mục `css`, thư mục `js` (chỉ ghi đè các file có trong gói; **KHÔNG ghi đè `js/config.js`** của cô), `HUONG-DAN.md`. Chờ 1–2 phút rồi bấm **Ctrl+Shift+R** (điện thoại: mở tab ẩn danh).
- Lần đầu chạy, Google Sheets tự tạo thêm trang tính **`profiles`** (mỗi học sinh 1 dòng: xu, avatar, thú nuôi, chủ đề, nhiệm vụ, câu sai…). Cô không cần sửa trang này.
- Gói này đã gồm các đợt 1–3: nếu cô chưa cập nhật các đợt trước, chỉ cần làm gói này là đủ.

### B. Xu & avatar lưu trên Google Sheets
- Xu, avatar, thú nuôi, chủ đề, nhiệm vụ, chuỗi ngày, danh sách câu sai đều lưu theo **tên học sinh** trong trang tính `profiles`. Đổi máy/điện thoại, đăng nhập lại vẫn còn.
- Máy lưu tạm trước rồi gửi lên sau ~3 giây; mất mạng vẫn chơi được, có mạng lại thì tự gửi. Nhiều máy cùng lúc: xu được cộng theo phần chênh lệch nên không bị ghi đè mất.
- Giới hạn chống gian lận: mỗi lần lưu, xu cộng thêm tối đa 400. Đây chỉ là rào cơ bản, không phải chống gian lận tuyệt đối (học sinh rành kỹ thuật vẫn có thể thử mở công cụ trình duyệt).
- Khu của cô → **Học viên**: mỗi em hiện xu, thú nuôi, chuỗi ngày từ `profiles`.

### C. Viết lại câu dạng điền chỗ trống + từ gợi ý (✍️ Viết lại câu)
Cú pháp: `câu gốc => câu thứ hai có chỗ trống ............ (từ gợi ý) => đáp án`
- Ví dụ 1: `she hates learning English => She ............ (dislike) => dislikes learning English / does not like learning English`
  → Học sinh thấy: *she hates learning English* và *She ............ (dislike)*; gõ vào chỗ trống. Chấp nhận cả 2 đáp án (ngăn bằng dấu `/`).
- Ví dụ 2 (nhiều chỗ trống, ngăn đáp án bằng `;`): `He started playing the piano two years ago. => He ............ (play) the piano ............ two years. => has played; for`
- Ví dụ 3 (cách gọn, đặt đáp án trong `[[ ]]`): `They built this bridge in 1990. => This bridge [[was built]] (build) in 1990.`
- Thêm dòng `EXP: ...` ngay sau câu để hiện lời giải thích khi xem đáp án.
- Cách cũ (`câu gốc | bắt đầu bằng => đáp án`) vẫn dùng được, có thể trộn chung 1 phần bài. Chấm không phân biệt hoa/thường, bỏ dấu câu; coi isn't = is not, I'm = I am.

### D. 🐾 Thú nuôi (góc phải màn hình)
- Mỗi học sinh chọn 1 bé (11 bé: 4 bé đầu miễn phí, các bé còn lại 40–200 xu), đặt tên tối đa 14 ký tự. Bé hiện nhỏ ở góc dưới bên phải mọi trang (kéo đi chỗ khác được), chạm vào để xem độ cute, cho ăn (−3 xu, +8 cute), đổi bé.
- Trả lời đúng → bé cute hơn, vui, lên cấp (7 cấp). Sai nhiều → bé buồn. **Lâu không học → bé nằm ngủ**; vào học lại thì bé tỉnh dậy.
- Hình bé do website tự vẽ, không cần tải ảnh.

### E. 🎯 Nhiệm vụ mỗi ngày + 🔥 chuỗi ngày học
- Mỗi ngày 3 nhiệm vụ (chọn trong 9 loại: đúng 10/25 câu, 1 bài luyện tập, nộp 1 bài tập, ôn 5 câu, sửa đúng 3 câu từng sai, combo x5, đánh bại 1 Boss, chơi 1 app/game). Xong từng nhiệm vụ nhận 4–10 xu; xong cả 3 được +10 xu.
- Chuỗi ngày học liên tiếp: thưởng ở ngày 3 (+5), 7 (+15), 14 (+30), 30 (+60). Bỏ 1 ngày thì chuỗi về 1.

### F. 🔁 Ôn lại theo lịch (câu sai quay lại đúng lúc)
- Câu học sinh làm sai (ở Luyện tập hoặc khi nộp bài tập) được đưa vào "sổ câu sai". Hệ thống hẹn ôn lại sau 1 → 3 → 7 → 14 → 30 ngày; làm đúng thì sang mốc xa hơn, làm sai thì về mốc 1 ngày. Đúng liên tiếp 5 lần thì xem như đã thuộc.
- Học sinh vào **Trang chủ → Ôn lại hôm nay**. Chỉ áp dụng cho câu thuộc **bài tập cô giao** (không áp dụng cho app HTML đăng riêng).

### G. 👾 Đánh Boss từ câu sai
- Trang chủ → **Đánh Boss**: Boss (7 loại ngộ nghĩnh) có thanh HP, mỗi câu đúng trừ HP Boss (hết câu = thắng); sai thì mất 1 trong 3 tim ❤️. Hết tim thì làm 1 câu bổ sung để hồi lại 1 tim, đúng mới đánh tiếp. Thắng Boss nhận xu (nhiều hơn nếu còn nhiều tim) + tính vào nhiệm vụ. Câu trong trận lấy từ các câu em từng sai, nên Boss "mạnh" theo chỗ em còn yếu.

### H. 🗺️ Bản đồ đảo theo unit
- Trong trang giáo trình có nút **🗺️ Bản đồ đảo**: mỗi unit là một hòn đảo, sao ★ (tối đa 3) tính theo kết quả các bài tập/luyện tập của unit đó (từ 85% đúng trở lên được 3 sao, từ 60% được 2 sao, có làm là 1 sao), nhân vật của em đứng ở đảo đang học dở. Chỉ hiển thị dữ liệu của em, cô không phải nhập gì.

### I. 🎨 Chủ đề giao diện (13 chủ đề)
- Cửa hàng → tab **Chủ đề**: Cực quang pastel, Kẹo ngọt, Biển xanh (miễn phí), Hoa anh đào, Rừng xanh, Hoàng hôn, Mùa hè, Lá thu, Trung thu, Giáng sinh, Tết, Chiều tím, Cầu vồng (30–60 xu). Đổi màu cả website + hiệu ứng rơi (hoa, lồng đèn, tuyết…). Mỗi em chọn riêng.

### J. 🖨️ In phiếu bài tập có đáp án
- Khu của cô → **📝 Bài tập** → nút **🖨️ In phiếu** ở mỗi bài → trang xem trước. Tick **Kèm trang đáp án** để in thêm trang đáp án (ở trang riêng, để phát phiếu rồi giữ đáp án; bỏ tick nếu chỉ in phiếu cho học sinh). Chọn cỡ chữ → bấm **In / Lưu PDF** (trong hộp thoại chọn máy in hoặc "Lưu dưới dạng PDF").
- Dạng cần tương tác (ghép cặp, kéo thả, lật thẻ, tìm từ, ô chữ) được chuyển sang dạng in được (ví dụ nối cột, bảng chữ). Cô nên xem trước khi in vì mỗi dạng chuyển khác nhau.

### K. 📨 Báo cáo tuần cho phụ huynh
- Khu của cô → **📊 Báo cáo học viên** → nút **📨 Báo cáo tuần cho phụ huynh (cả lớp)**, hoặc nút cùng tên trong thẻ từng em. Văn bản tự viết từ 7 ngày gần nhất: số ngày học, số lượt chơi, số bài nộp, tỉ lệ đúng, điểm mạnh, phần cần ôn, gợi ý cho phụ huynh.
- Cô sửa trực tiếp trong khung, thêm lời nhắn, rồi **📋 Sao chép** (dán Zalo/tin nhắn) hoặc **🖨️ In**.

### L. Nói thật về giới hạn
- Chưa thử trên Apps Script thật và thiết bị thật của cô: các bước kiểm tra đã chạy ở chế độ thử trên máy tính. Cô thử 1 học sinh trước (đăng nhập, làm vài câu, đổi máy, xem trang tính `profiles`) rồi mới phát cho cả lớp.
- Kéo thú nuôi bằng cảm ứng và máy iPad chưa kiểm tra thực tế; nếu bé che nút, cô báo mình để chỉnh.
- Chống gian lận xu chỉ ở mức cơ bản (giới hạn 400 xu/lần lưu).
- Sổ câu sai/Ôn lại/Boss chỉ lấy từ bài tập cô giao và phần Luyện tập, không lấy từ app HTML đăng riêng (app chỉ cho xu khi chơi).
- Nội dung câu hỏi, tên unit vẫn do cô nhập; website không có sẵn nội dung sách giáo khoa.
