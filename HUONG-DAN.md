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

## Cập nhật đợt 5 (ảnh biểu tượng của cô + chibi cô Thảo chuyển động)

### A. Cách cập nhật
Gói `cap-nhat-dot5.zip` chỉ gồm file website (không cần đổi Code.gs nếu cô đã làm đợt 4). Giải nén, up lên GitHub (thư mục gốc của repo): `index.html`, thư mục `css`, thư mục `js` (**không ghi đè `js/config.js`**), thư mục **`assets/ui`** (chứa ảnh), `HUONG-DAN.md`. Chờ 1–2 phút rồi bấm Ctrl+Shift+R.

### B. Ảnh đã được gắn vào đâu
| Ảnh | Hiển thị ở |
|---|---|
| nv-dung, nv-luyentap, nv-nopbai, nv-onlai, nv-suasai, nv-combo, nv-boss, nv-game | 9 nhiệm vụ hằng ngày (và nv-dung khi nhiệm vụ đã xong) |
| hop-qua | dòng "Xong cả 3 nhiệm vụ: +10 xu" |
| tim, tim-mat | 3 trái tim trong trận Boss (còn tim / mất tim) |
| nv-combo | chuỗi ngày học, combo |
| nv-onlai, o-boss, o-cuahang | 3 ô lớn ở trang chủ: Ôn lại hôm nay, Đánh Boss, Cửa hàng |
| o-bando | nút và tiêu đề Bản đồ đảo |
| o-boss | con Boss "Quái Vật Từ Vựng" trong trận và nút Boss của từng bài |
| gt-starters, gt-flyers | thẻ giáo trình có biểu tượng 🌱 (Starters) và 🚀 (Flyers) |
| chibi-chi-bang, chibi-nhay-mat, chibi-an-mung, chibi-ngap | chibi cô Thảo ở trang chủ và các màn hình kết quả |

Ảnh nào bị thiếu (xóa hoặc chưa tải lên) thì website tự quay về emoji cũ, không bị vỡ trang.

### C. Chibi cô Thảo chuyển động
- Ở trang chủ: chibi nhún nhảy nhẹ, lấp lánh xung quanh. **Chạm vào chibi**: chibi nhảy lên và nói một câu (có nhiều câu khác nhau).
- Tư thế tự đổi theo tình trạng của học sinh: chưa học hôm nay → chỉ bảng (hướng dẫn); đã học hôm nay → nháy mắt, giơ ngón cái; xong cả 3 nhiệm vụ → giơ cúp, bay confetti; **để yên 1 phút không chạm gì → chibi ngáp**, chạm lại thì tỉnh dậy.
- Màn kết quả luyện tập: ≥80% đúng → giơ cúp; từ 50% → nháy mắt; dưới 50% → chỉ bảng. Thắng Boss → giơ cúp; thua Boss → ngáp ("Không sao, mình thử lại nha!").
- Máy nào bật chế độ "giảm chuyển động" thì chibi đứng yên (cho học sinh dễ bị chóng mặt).
- Ảnh chibi chỉ dùng **nửa người trên** (từ đầu đến eo, mờ dần ở eo), không hiện chân và váy. Ảnh chibi toàn thân cô gửi sau này mình cũng sẽ cắt như vậy hoặc bỏ đi.
- Thanh menu vẫn dùng ảnh chibi đầu tròn cũ (`assets/chibi.png`). Cô muốn đổi thì gửi ảnh mới cho mình.

### D. (đã cập nhật ở đợt 6, xem bên dưới)

## Cập nhật đợt 6 (bộ ảnh đầy đủ: avatar, thú nuôi, Boss, chủ đề, chibi 8 kiểu)

### A. Cách cập nhật (gói cuối, đủ mọi thứ từ đợt 4 đến đợt 6)
Gói `cap-nhat-cuoi.zip` gồm toàn bộ file website đã đổi từ đợt 4 trở đi. Cô **chỉ cần làm gói này** (không phải làm lại gói đợt 4 và đợt 5). Giải nén rồi up lên GitHub (thư mục gốc của repo): `index.html`, thư mục `css`, thư mục `js` (**không ghi đè `js/config.js`**, gói này cũng không có file đó), thư mục **`assets/ui`** (khoảng 7 MB ảnh), `HUONG-DAN.md`. Phần Google Sheets: dùng file `Code.gs` trong gói (nếu cô chưa dán Code.gs mới thì làm Bước "Cập nhật Code.gs" ở đợt 4; nhớ gõ lại 2 mật khẩu lớp/cô ở đầu file). Chờ 1–2 phút rồi bấm Ctrl+Shift+R.

### B. Ảnh đã gắn vào đâu
| Ảnh | Hiển thị ở |
|---|---|
| av-sprout, av-cat, av-dog, av-rabbit, av-fox, av-panda, av-frog, av-koala, av-tiger, av-lion, av-unicorn, av-dragon | 12 avatar: Cửa hàng → Avatar, ảnh nhỏ cạnh tên học sinh trên thanh menu, nhân vật đứng trên đảo đang học dở ở Bản đồ đảo |
| pet-cat, pet-dog, pet-bunny, pet-chick, pet-panda, pet-fox, pet-penguin, pet-hamster, pet-frog, pet-dragon, pet-unicorn | thú nuôi ở góc phải màn hình, trong bảng thú nuôi, khi chọn thú nuôi và Cửa hàng → Thú nuôi |
| boss-tuvung, boss-nguphap, boss-luoihoc, boss-muc, boss-rong, boss-chinhta, boss-robot | 7 con Boss, mỗi trận Boss gặp ngẫu nhiên một con |
| th-default (cực quang), th-candy, th-ocean, th-sakura, th-forest, th-sunset, th-summer, th-autumn, th-mooncake, th-xmas, th-tet, th-twilight, th-rainbow | 13 huy hiệu chủ đề trong Cửa hàng → Chủ đề |
| chibi-chi-bang, chibi-dung, chibi-vay-tay | tư thế "hướng dẫn" (trang chủ khi chưa học hôm nay) |
| chibi-nhay-mat, chibi-co-vu | tư thế "khen" (đã học hôm nay, kết quả 50–79%) |
| chibi-an-mung, chibi-reo-ho | tư thế "ăn mừng" (xong nhiệm vụ, thắng Boss, kết quả từ 80%) |
| chibi-ngap | tư thế "buồn ngủ" (để yên 1 phút, thua Boss) |

### C. Những điều cô nên biết
- **Chibi 8 kiểu**: mỗi tư thế có 2–3 kiểu ảnh. Mỗi lần vào trang, kiểu hiện ra ngẫu nhiên; **chạm vào chibi** thì đổi sang kiểu khác cùng tư thế, chibi nhảy và nói một câu. Cả 8 ảnh đều cắt **nửa người trên** (từ đầu đến eo, mờ dần ở eo), không hiện chân.
- **Thú nuôi chỉ có 1 dáng ảnh** (dáng bình thường), nên cảm xúc được thể hiện bằng hiệu ứng: vui/yêu thì nhún nhảy; buồn thì ảnh xám đi, cúi xuống, có giọt nước; ngủ thì nghiêng, tối đi, có chữ Zzz. Phụ kiện theo cấp (nơ, ngôi sao, mũ phù thủy, vương miện, lấp lánh) hiện **đè lên ảnh** dưới dạng biểu tượng nhỏ, không phải vẽ riêng cho từng bé. Nếu sau này cô vẽ thêm các dáng vui, buồn, ngủ thì mình thay vào được.
- **Kỳ lân (thú nuôi)** chưa có ảnh nên vẫn là hình vẽ cũ. Avatar Kỳ lân thì đã có ảnh.
- **Rô-bốt (Boss)**: ảnh gốc nằm trên nền tròn vàng giống avatar. Mình đã tách nền để giống các Boss khác. Cô muốn giữ nền tròn thì báo mình.
- Ảnh nào bị thiếu thì website tự quay về emoji hoặc hình vẽ cũ, không bị vỡ trang.
- Mở trang đầu tiên có thể chậm hơn một chút vì có nhiều ảnh (mạng yếu thì ảnh hiện dần).

### D. Còn thiếu ảnh nào (vẫn dùng emoji hoặc hình cũ)
- Thú nuôi: các dáng vui, buồn, ngủ của cả 11 bé (hiện dùng hiệu ứng thay thế).
- Ảnh chibi đầu tròn trên thanh menu (đang dùng ảnh cũ `assets/chibi.png`).
- Hiệu ứng rơi bằng ảnh riêng (hiện là emoji).

---

## Cập nhật đợt 7: Tạo bài tập từ file Word (.docx)

**Cách dùng:** Khu của cô → Bài tập → **📄 Tạo từ file Word** → chọn file .docx → xem bản xem trước (số phần, số câu, cảnh báo) → **Đưa vào bài tập** → chọn lớp/unit, kiểm tra lại, bấm **Lưu** → ở danh sách bài tập bấm **🔗 Link** để sao chép đường link gửi học sinh (học sinh đăng nhập bằng tên + mật khẩu lớp rồi làm bài).

**File Word cần có:**
- Câu hỏi dạng `Question 1.` / `Câu 1.` / `1.`; đáp án A. B. C. D. nằm cùng dòng hoặc xuống dòng đều được.
- Dòng yêu cầu (bắt đầu bằng Choose / Mark / Read / Supply / Find / Rewrite / Complete...) sẽ thành tên phần bài.
- Đoạn văn (đoạn thường hoặc trong bảng) đặt ngay sau dòng yêu cầu, trước câu hỏi → thành đoạn văn của phần.
- Cuối file: tiêu đề có chữ **ĐÁP ÁN** và bảng 3 cột **Câu | Đáp án | Giải thích**. Dòng "PHẦN I: ... (1 – 12)" trong bảng đáp án sẽ tách bài thành các phần tương ứng và làm chủ điểm cho báo cáo.

**Nhận ra được:** trắc nghiệm A/B/C/D (gồm phát âm, trọng âm, điền chỗ trống trong đoạn văn, đọc hiểu); điền từ có gợi ý `____ (BENEFIT)` (đáp án lấy từ bảng); tìm lỗi sai `(A)(B)(C)(D)` với đáp án `C (find → finds)`; viết lại câu (dòng thứ hai bắt đầu bằng →, đáp án là câu đầy đủ).

**Chữ gạch chân** trong Word được giữ (hiện gạch chân cho học sinh và khi in).

**Chưa nhận ra:** hình ảnh trong file, đúng/sai, nối cột, câu không đánh số. Các câu này được báo ở khung "Cần cô lưu ý" để cô thêm tay.

**Cập nhật:** tải lên GitHub các file: `index.html`, `js/docx.js`, `js/engine.js`, `js/print.js`, `js/teacher.js`, thư mục `vendor/jszip/` và file này. KHÔNG ghi đè `js/config.js`.

## Cập nhật đợt 7 (bài đọc chọn ngay trong đoạn văn · đoạn văn ghim khi làm bài · báo cáo TỪNG BÀI nộp)

### A. Cách cập nhật (làm đúng thứ tự)
1. **Apps Script (bắt buộc, để lưu thêm "em chọn gì / đáp án đúng"):** mở Google Sheet của lớp → Tiện ích mở rộng → Apps Script → **xoá hết code cũ, dán toàn bộ file `apps-script/Code.gs` mới** (giữ nguyên hai mật khẩu ở đầu file như cô đã đặt, đừng để về `DOI-MAT-KHAU-...`) → Lưu → **Triển khai → Quản lý bản triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.** (Không tạo triển khai mới để link /exec không đổi.)
2. Tải lên GitHub: `index.html`, `css/style.css`, `js/engine.js`, `js/docx.js`, `js/api.js`, `js/app.js`, `js/play.js`, `js/teacher.js`. KHÔNG ghi đè `js/config.js`.
3. Trang tính `answers` sẽ tự có thêm 4 cột `sec`, `no`, `ans`, `key`; dữ liệu cũ giữ nguyên.

### B. Báo cáo từng bài nộp (không còn gộp lẫn các bài)
- **📊 Báo cáo học viên → bấm tên em → "📝 Từng bài đã nộp"**: mỗi bài một dòng (bài nào, lần mấy, ngày giờ, điểm). Bấm **Xem chi tiết** để thấy theo từng PHẦN → từng CÂU: đề bài, **em chọn gì**, **đáp án đúng**, đúng/sai. Có tab "Chỉ câu sai" / "Tất cả" và nút **📋 Sao chép** (dán gửi phụ huynh).
- **📝 Bài tập → Kết quả** của một bài: mỗi em có các nút "Lần 1, Lần 2…" để xem chi tiết đúng bài đó.
- Phần "Độ chính xác theo chủ điểm" vẫn là thống kê GỘP của mọi bài (để thấy chủ điểm yếu); bảng "Câu/ý sai nhiều nhất" nay có thêm cột **Bài / nguồn**. "Sao chép báo cáo" và báo cáo tuần cho phụ huynh có thêm danh sách các bài đã nộp, mỗi bài một dòng.
- **Bài nộp cũ** (trước đợt này) chỉ có đề và đúng/sai, không có "em chọn gì" vì lúc đó app chưa lưu; từ bài nộp mới trở đi sẽ đầy đủ.

### C. Bài đọc điền chỗ trống (21)(22)… và bài đọc hiểu
- Nhập file Word có đoạn văn "(21) ____" + các câu "Question 21. A. … B. … C. …": app tự gộp thành **một bài "Điền từ (chọn trong danh sách)"**, ô chọn nằm ngay trong đoạn văn, học sinh không phải kéo xuống. (Cần file Word có bảng đáp án để biết đáp án đúng; nếu thiếu, app giữ dạng trắc nghiệm cũ.)
- Bài đọc hiểu (đoạn văn dài + câu hỏi): đoạn văn được **ghim** cạnh câu hỏi (2 cột trên máy tính; dính ở đầu trang trên điện thoại, có nút "▲ Thu gọn").
## Speaking Test Flyers (mới)
- Vào lớp **Cambridge Flyers → SPEAKING → "Speaking Test – 40 bộ đề (4 Parts)"**.
- 40 bộ (28 từ sách + 12 bộ Claude soạn, ảnh AI): 5 bộ Practice Tests Plus (có script giám khảo, đáp án Part 1–3 và câu Part 4 chính thức), 12 bộ Cambridge Authentic Papers (Flyers 1–4), 3 bộ Collins, 8 bộ Succeed, 12 bộ "Bộ soạn thêm (ảnh AI)".
- Part 1 và Part 2: hai hình đặt cạnh nhau. Part 3: hình xoay ngang. Part 4: câu hỏi từng câu một.
- **Hint**: chạm vào hình để hiện từ vựng / giới từ / mẫu câu, chạm lần nữa để ẩn. Hint và câu Part 4 của các bộ ngoài Practice Tests Plus là **Claude soạn**, không phải đề gốc.
- Nút 👩‍🏫 hiện/ẩn gợi ý và đáp án cho cô.
- Hình nằm ở `apps/flyers/speaking/img/<mã bộ>/`. Dữ liệu (hint, câu Part 4) nằm trong thẻ `<script id="DATA">` ở đầu file `speaking.html`, cô sửa trực tiếp được.

## Starters Speaking (mới)
- Vào lớp **Cambridge Starters → SPEAKING → "Starters Speaking – bộ đề (4 Parts)"**. Hiện có **Test 1** (từ sách YLE Practice Tests Plus Starters); Test 2–5 hiện ổ "Sắp có" cho đến khi có ảnh.
- 4 Part: (1) chỉ tranh + kéo thẻ đặt lên tranh, (2) nhìn tranh trả lời, (3) thẻ đồ vật (chạm để lật), (4) nói về em. Giám khảo là chibi Miss Thảo hỏi bằng bong bóng chữ.
- **Nút "Em chưa hiểu"** cho nhiều mức gợi ý liên tiếp (câu hỏi dễ hơn → câu hỏi lựa chọn → câu mẫu để em nói theo). Mức 1 là câu back-up của sách (nếu có); các mức sau do Claude soạn (chế độ Cô sẽ ghi rõ).
- **Thẻ đã tách nền**: khi kéo thẻ lên tranh chỉ còn hình đồ vật (có viền trắng kiểu sticker), không còn khung trắng.
- **Âm thanh**: hiệu ứng là tiếng chuông mềm. Giọng giám khảo dùng giọng đọc của máy; bấm nút **🗣️ Giọng** (chỉ hiện với cô) để chọn giọng và tốc độ. Nếu nghe còn rè, chọn giọng có chữ "Natural", "Online" hoặc "Google". Muốn giọng thật tự nhiên hơn: bỏ file mp3 vào thư mục `img/` rồi khai báo trong `data.json` ở mục `audio` (câu tiếng Anh → đường dẫn file); app ưu tiên file mp3, không có thì dùng giọng máy.
- **Sao và sticker được lưu lên Google Sheets** (cùng trang tính `profiles` với xu, thú nuôi). Để bật: dán lại **`apps-script/Code.gs` mới** vào Apps Script (giữ nguyên 2 mật khẩu) → Lưu → **Triển khai → Quản lý bản triển khai → ✏️ → Phiên bản mới → Triển khai**. Chưa dán thì app vẫn chạy và lưu trên máy, sao sẽ tự đồng bộ lên Sheet sau khi cập nhật.
- **Thêm bộ mới** (thư mục `apps/starters/speaking/_work/`):
  1. Bỏ ảnh thẻ (nền trắng) vào `_work/raw/<mã bộ>/<tên>.png` và ảnh tranh cảnh vào `img/<mã bộ>/scene.webp`.
  2. Chạy `python3 _work/cutout.py <mã bộ>` để tách nền (cần `pip install pillow numpy`).
  3. Thêm bộ vào `_work/data.json` (sao chép cấu trúc của `ptp-t1`: vùng chỉ trên tranh `hot`, vùng đặt thẻ `zones`, câu Part 1–4 và `hints`).
  4. Chạy `python3 _work/build.py` để tạo lại `speaking.html`.
