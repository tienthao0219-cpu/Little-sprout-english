# Gắn chế độ "📖 Học thẻ" (lật thẻ: hình → nghĩa + nghe, tới/lui, xáo trộn) vào các app flashcard (Picture cards / Thẻ từ vựng).
# Chạy lại được nhiều lần (thay phần cũ). Dùng:  python3 add_learn_mode.py [file.html ...]   (không tham số = quét toàn bộ apps/)
import re, sys, glob, os
T = os.path.dirname(os.path.abspath(__file__)) + '/'
CSS = open(T + 'learn.css', encoding='utf8').read().strip()
JS = open(T + 'learn.js', encoding='utf8').read().strip()
BTN_OLD = '<button data-m="cards" class="on">🃏 Thẻ từ</button>'
BTN_NEW = BTN_OLD + '<button data-m="learn">📖 Học thẻ</button>'
SEC_OLD = '<section id="practice"></section>'
SEC_NEW = SEC_OLD + '\n<section id="learn"></section>'

def inject(html):
    html = html.replace('<button data-m="learn">📖 Học từng thẻ</button>', '<button data-m="learn">📖 Học thẻ</button>')   # đổi nhãn bản cũ
    if 'data-m="learn"' not in html:
        assert BTN_OLD in html, 'không thấy thanh chế độ'
        html = html.replace(BTN_OLD, BTN_NEW, 1)
    if 'id="learn"' not in html:
        assert SEC_OLD in html, 'không thấy #practice'
        html = html.replace(SEC_OLD, SEC_NEW, 1)
    css = '<style id="learn-css">\n' + CSS + '\n</style>'
    js = '<script id="learn-js">\n' + JS + '\n</script>'
    if re.search(r'<style id="learn-css">.*?</style>', html, re.S): html = re.sub(r'<style id="learn-css">.*?</style>', lambda m: css, html, count=1, flags=re.S)
    else: html = html.replace('</head>', css + '\n</head>', 1)
    if re.search(r'<script id="learn-js">.*?</script>', html, re.S): html = re.sub(r'<script id="learn-js">.*?</script>', lambda m: js, html, count=1, flags=re.S)
    else: html = html.replace('</body>', js + '\n</body>', 1)
    return html

def is_deck(path, html): return 'id="practice"' in html and 'const originalCards=' in html and '/grammar/' not in path and '/speaking/' not in path

if __name__ == '__main__':
    root = T + '../../'
    files = sys.argv[1:] or sorted(glob.glob(root + '*/*/*.html'))
    n = 0
    for f in files:
        h = open(f, encoding='utf8').read()
        if not is_deck(f, h): continue
        new = inject(h)
        if new != h:
            with open(f, 'w', encoding='utf8') as fh: fh.write(new)
            n += 1
    print('đã cập nhật', n, 'file')
