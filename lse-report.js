/* ============================================================
   DÁN ĐOẠN NÀY VÀO APP HTML MỚI để app báo kết quả về trang Little Sprout English.
   (App cùng "họ" với Countryside Hub không cần đoạn này, trang tự gắn mã.)

   Mỗi khi học viên trả lời xong một câu, gọi:
       LSE_REPORT.answer("ma-cau", "Chủ điểm của câu", true /* đúng */, "Nội dung câu hỏi ngắn", "đáp án em chọn/gõ (khi sai)", "đáp án đúng");
   (hai tham số cuối không bắt buộc; có thì "Xem chi tiết" ở báo cáo sẽ hiện em trả lời gì và đáp án đúng là gì)
   Khi kết thúc một lượt chơi (không bắt buộc):
       LSE_REPORT.finish(diemDat, diemToiDa);
   ============================================================ */
window.LSE_REPORT = {
  answer: function (qid, topic, ok, text, ans, key) {
    try { parent.postMessage({ lse: 1, kind: "answer", qid: String(qid), topic: String(topic || ""), ok: !!ok, q: String(text || "").slice(0, 160), ans: String(ans || "").slice(0, 100), key: String(key || "").slice(0, 100) }, "*"); } catch (e) { }
  },
  finish: function (score, max) {
    try { parent.postMessage({ lse: 1, kind: "finish", score: +score || 0, max: +max || 0 }, "*"); } catch (e) { }
  }
};
