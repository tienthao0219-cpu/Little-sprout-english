# -*- coding: utf-8 -*-
"""Sinh PROMPTS-movers-ai.md (prompt ảnh cho cô Thảo) từ specs.py.   python3 make_prompts.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from specs import SPECS, DEMOS
STYLE = ("Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, "
         "friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark.")
def p1a(sp): return "Portrait 2:3 picture. %s Scene: %s. Show every object clearly and separated from the others, nothing cropped or hidden." % (STYLE, sp['p1']['scene'])
def p1b(sp):
    ex = sp['p1']['example']; lines = ["Example change: " + (ex[2] if len(ex) > 2 else "make it so that %s (instead of: %s)" % (ex[1], ex[0]))]
    for i, d in enumerate(sp['p1']['diffs'], 1): lines.append("Change %d: %s." % (i, d[0]))
    return ("Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same "
            "(it must look like the same picture with small edits). Change ONLY these five things and nothing else:\n" + "\n".join("- " + l for l in lines))
def p2(sp):
    st = sp['story']; ps = "\n".join("Panel %d: %s" % (i, t) for i, t in enumerate(st['panels'], 1))
    return ("Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. "
            "%s Same characters in every panel (same faces, hair and clothes): %s. The story is called \"%s\".\n%s" % (STYLE, st['names'], st['title'], ps))
def p3(sp):
    d = DEMOS[sp['demo']]; rows = [(d[0], d[1])] + [(r[0], r[1]) for r in sp['rows']]
    out = []
    for i, (items, odd) in enumerate(rows, 1):
        out.append("Row %d (left to right): %s." % (i, "; ".join("%s" % it for it in items)))
    return ("Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). "
            "%s One clear subject per picture, same style across all 16, subject big and centred.\n%s" % (STYLE, "\n".join(out)))
def build():
    L = ["# Movers Speaking – 12 bộ soạn thêm (ai-t1 … ai-t12): prompt tạo ảnh cho ChatGPT", "",
         "Cô tạo mỗi bộ **4 file ảnh**, đặt tên đúng như dưới đây rồi gửi cho Claude (hoặc để vào thư mục `ai_in`):", "",
         "| File | Nội dung | Gợi ý tạo |", "|---|---|---|",
         "| `ai-tN_p1a.png` | Part 1 – tranh của cô (A) | tạo mới, tỉ lệ dọc 2:3 |",
         "| `ai-tN_p1b.png` | Part 1 – tranh của em (B) | **gửi kèm ảnh A** rồi dán prompt B (nhờ ChatGPT sửa đúng 5 chỗ) |",
         "| `ai-tN_p2.png` | Part 2 – 4 tranh kể chuyện (lưới 2×2) | tạo mới, 1 ảnh |",
         "| `ai-tN_p3.png` | Part 3 – 4 bộ × 4 tranh (lưới 4×4) | tạo mới, 1 ảnh; nếu sai/thiếu tranh thì tạo từng hàng, đặt tên `ai-tN_p3_row1.png` … `row4.png` |", "",
         "**Mẹo:** tạo trong cùng một cuộc trò chuyện cho mỗi bộ; nếu nhân vật Part 2 đổi mặt giữa các ô thì bảo ChatGPT 'giữ nguyên nhân vật'. "
         "Part 1: hai tranh phải **giống hệt** nhau trừ 5 chỗ ghi trong prompt B – kiểm tra kỹ vì chỗ khác thừa sẽ làm sai đáp án.",
         "Hình không có chữ/số. Nếu ChatGPT vẽ chữ thì bảo vẽ lại không chữ.", "", "---", ""]
    for sp in SPECS:
        n = sp['id'].split('-t')[1]; ex = sp['p1']['example']
        L += ["## Bộ %s – %s (`%s`)" % (n, sp['theme'], sp['id']), "",
              "**Kế hoạch nội dung (để cô đối chiếu):**",
              "- Part 1 – ví dụ giám khảo nói: “Here %s, but here %s.”" % (ex[0], ex[1]),
              "- Part 1 – 4 điểm khác: " + "; ".join("%s → %s" % (d[4], d[5]) for d in sp['p1']['diffs']),
              "- Part 2 – truyện “%s” (%s)" % (sp['story']['title'], sp['story']['names']),
              "- Part 3 – bộ 1 (mẫu): " + ", ".join(DEMOS[sp['demo']][0]) + " → khác loại: " + DEMOS[sp['demo']][0][DEMOS[sp['demo']][1] - 1],
              ] + ["- Part 3 – bộ %d: %s → khác loại: %s" % (i + 2, ", ".join(r[0]), r[0][r[1] - 1]) for i, r in enumerate(sp['rows'])] + [
              "- Part 4 – chủ đề: %s" % sp['topic'], "",
              "**Prompt ảnh Part 1 – tranh A** (`%s_p1a.png`)" % sp['id'], "```", p1a(sp), "```", "",
              "**Prompt ảnh Part 1 – tranh B** (`%s_p1b.png`, gửi kèm ảnh A)" % sp['id'], "```", p1b(sp), "```", "",
              "**Prompt ảnh Part 2 – kể chuyện** (`%s_p2.png`)" % sp['id'], "```", p2(sp), "```", "",
              "**Prompt ảnh Part 3 – odd one out** (`%s_p3.png`)" % sp['id'], "```", p3(sp), "```", "", "---", ""]
    return "\n".join(L)
if __name__ == '__main__':
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'PROMPTS-movers-ai.md'); open(out, 'w', encoding='utf8').write(build()); print('wrote', out, len(build()))
