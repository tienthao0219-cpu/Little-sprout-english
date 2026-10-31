# Đổi mã của cô cho Movers Speaking:  python3 _work/set_code.py <mã mới>   rồi  python3 _work/build.py  và đẩy lên GitHub
import sys, os
if len(sys.argv) < 2 or len(sys.argv[1].strip()) < 4: sys.exit('Cần mã mới (ít nhất 4 ký tự). Ví dụ: python3 _work/set_code.py maCuaCo2026')
x = 2166136261
for c in sys.argv[1].strip().lower(): x ^= ord(c); x = (x * 16777619) & 0xFFFFFFFF
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tcode.txt'), 'w').write(format(x, 'x')); print('Đã đổi mã. Nhớ chạy build.py.')
