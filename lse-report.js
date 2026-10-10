/* ============================================================
   DÁN ĐOẠN NÀY VÀO APP HTML MỚI để app báo kết quả về trang Little Sprout English.
   (App cùng "họ" với Countryside Hub không cần đoạn này, trang tự gắn mã.)

   Mỗi khi học viên trả lời xong một câu, gọi:
       LSE_REPORT.answer("ma-cau", "Chủ điểm của câu", true /* đúng */, "Nội dung câu hỏi ngắn");
   Khi kết thúc một lượt chơi (không bắt buộc):
       LSE_REPORT.finish(diemDat, diemToiDa);
   ============================================================ */
window.LSE_REPORT = {
  answer: function (qid, topic, ok, text) {
    try { parent.postMessage({ lse: 1, kind: "answer", qid: String(qid), topic: String(topic || ""), ok: !!ok, q: String(text || "").slice(0, 160) }, "*"); } catch (e) { }
  },
  finish: function (score, max) {
    try { parent.postMessage({ lse: 1, kind: "finish", score: +score || 0, max: +max || 0 }, "*"); } catch (e) { }
  }
};
