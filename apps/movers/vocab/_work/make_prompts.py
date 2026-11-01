# -*- coding: utf-8 -*-
"""Sinh PROMPTS-Movers-vocab.md (prompt tạo ảnh lưới 3x3 / 2x3) từ vocab_data.py, và grids.json (để sau này cắt ảnh)."""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vocab_data import U
STYLE = ("Children's picture-dictionary illustration for young English learners (Cambridge Movers level): bright flat colours, clean dark outlines, "
         "cute friendly cartoon style. No text, no letters, no numbers, no watermark.")
KIDS = "Whenever a child appears use the same two cartoon children: a girl with a brown ponytail and a pink hair bow, and a boy with short brown hair and a blue hoodie."
def chunks(n):
    best = None
    def rec(rem, acc):
        nonlocal best
        if rem <= 0:
            key = (len(acc), sum(acc) - n)
            if best is None or key < best[0]: best = (key, acc[:])
            return
        for c in (9, 6):
            rec(rem - c, acc + [c])
    rec(n, [])
    return best[1]
def build():
    plan = {'units': []}; L = []
    L += ["# Movers – Từ vựng: prompt tạo ảnh (lưới 3×3 và 2×3)", "",
          "**Cách dùng:** mỗi mục dưới đây là một ảnh lưới. Dán prompt vào ChatGPT, tạo ảnh **vuông** (lưới 3×3) hoặc **ngang 3:2** (lưới 3 cột × 2 hàng), đặt tên file đúng như ghi (ví dụ `mv-u01-g1.png`) rồi gửi cho mình. Các ô đánh số **từ trái sang phải, từ trên xuống dưới**.", "",
          "**Kiểm tra mỗi ảnh:** mỗi ô đúng một hình, **không có chữ/số**, các ô cùng cỡ, có khe trắng giữa các ô. Nếu một ô sai thì bảo ChatGPT vẽ lại *chỉ ô đó* hoặc cả ảnh; không cần tạo lại cả unit.", "",
          "## Cô xem giúp 6 điểm trước khi tạo ảnh", "",
          "1. **Thứ trong tuần (Unit 2, 7 từ):** không có ảnh AI nào vẽ được \"Monday\" mà không có chữ, nên mình đề xuất app tự hiện **thẻ chữ màu** cho 7 ngày (không cần ảnh). Cô đồng ý thì giữ nguyên, nếu muốn ảnh thì nhắn mình.",
          "2. **Từ trùng nhau giữa các unit:** *bat* (Unit 4 = cái gậy, Unit 9 = con dơi) tạo **hai ảnh khác nhau**; *cook* (Unit 2 = nấu ăn, Unit 6 = đầu bếp) cũng hai ảnh; *cage* (Unit 4, 9) và *rainbow* (Unit 9, 10) chỉ tạo **một lần** rồi dùng lại.",
          "3. **Từ gộp hai dạng** (*text/email*, *film/movie*, *lift/elevator*, *foot/feet*, *teeth/tooth*, *leaf/leaves*): *text* và *email* mình tách thành **2 ảnh**; các từ còn lại là **1 ảnh** cho cả hai dạng.",
          "4. **Từ trái nghĩa (Unit 1):** *tall/short/long/big/small/young/old* vẽ mỗi từ một ảnh có so sánh. *short* trong danh sách có hai nghĩa (thấp / ngắn); mình vẽ nghĩa **thấp** (bé trai thấp bên cạnh chú cao).",
          "5. **Từ chỉ quan hệ gia đình (Unit 7):** *aunt, uncle, daughter, son, granddaughter, grandson, parent, grandparent, grown-up* rất khó phân biệt qua một hình. Mình mô tả theo tình huống (ví dụ *granddaughter* = bé gái ôm bà). Cô xem ảnh rồi cho ý kiến; nếu thấy khó hiểu với học sinh thì mình đổi cách vẽ.",
          "6. **Danh sách của cô thiếu nghĩa tiếng Việt** ở *CD, DVD, internet, website* và các thứ trong tuần. Mình tạm để trống, cô bổ sung khi tiện (hoặc để mình điền *đĩa CD, đĩa DVD, mạng internet, trang web*).", "",
          "**Prompt chung (đã nằm sẵn trong từng ảnh):** " + STYLE, "", "---", ""]
    total_imgs = 0; total_grids = 0
    for u in U:
        imgs = [(w, vi, tp, d) for (w, vi, tp, d) in u['items'] if isinstance(d, str)]
        cs = chunks(len(imgs)); pos = 0; gl = []
        L += ["## Unit %d · %s" % (u['n'], u['title']), "", "%d từ cần ảnh · %d ảnh lưới" % (len(imgs), len(cs)), ""]
        skip = [w for (w, vi, tp, d) in u['items'] if d is None]; reuse = [(w, d[1]) for (w, vi, tp, d) in u['items'] if isinstance(d, tuple)]
        if skip: L += ["Không cần ảnh (app dùng thẻ chữ): " + ", ".join(skip), ""]
        if reuse: L += ["Dùng lại ảnh đã có: " + ", ".join("%s (từ %s)" % (w, r) for w, r in reuse), ""]
        for gi, c in enumerate(cs, 1):
            cells = imgs[pos:pos + c]; pos += c
            cols, rows = (3, 3) if c == 9 else (3, 2)
            fid = 'mv-u%02d-g%d' % (u['n'], gi); gl.append({'file': fid, 'cols': cols, 'rows': rows, 'words': [x[0] for x in cells] + [None] * (c - len(cells))})
            shape = "Square picture" if c == 9 else "Landscape picture, 3:2 ratio"
            lines = ["Cell %d (%s %s): %s." % (i, ['top','middle','bottom'][(i - 1) // 3 if c == 9 else (i - 1) // 3] if False else "row %d" % ((i - 1) // 3 + 1), "col %d" % ((i - 1) % 3 + 1), x[3]) for i, x in enumerate(cells, 1)]
            for j in range(len(cells) + 1, c + 1): lines.append("Cell %d (row %d col %d): leave completely EMPTY, plain cream colour, no picture." % (j, (j - 1) // 3 + 1, (j - 1) % 3 + 1))
            prompt = ("%s with a grid of %d columns x %d rows = %d equal square cells, each cell in its own thin dark rounded frame with a clear white gap between cells, plain soft pastel background in each cell (a different pastel colour per row). "
                      "%s One clear subject per cell, centred and big. %s Same drawing style in all cells.\n%s") % (shape, cols, rows, c, STYLE, KIDS, "\n".join(lines))
            L += ["### Ảnh %s.png (%d×%d)" % (fid, cols, rows), "", "Thứ tự ô: " + " · ".join("%d %s" % (i, x[0]) for i, x in enumerate(cells, 1)), "", "```", prompt, "```", ""]
        plan['units'].append({'n': u['n'], 'title': u['title'], 'grids': gl}); total_imgs += len(imgs); total_grids += len(cs)
        L += ["---", ""]
    L.insert(2, "**Tổng: %d từ cần ảnh trong %d ảnh lưới (12 unit).**\n" % (total_imgs, total_grids))
    return "\n".join(L), plan, total_imgs, total_grids
if __name__ == '__main__':
    md, plan, ti, tg = build(); here = os.path.dirname(os.path.abspath(__file__))
    open(os.path.join(here, 'PROMPTS-Movers-vocab.md'), 'w', encoding='utf8').write(md); json.dump(plan, open(os.path.join(here, 'grids.json'), 'w'), ensure_ascii=False, indent=1)
    print('ảnh cần', ti, '| ảnh lưới', tg, '| md', len(md))
