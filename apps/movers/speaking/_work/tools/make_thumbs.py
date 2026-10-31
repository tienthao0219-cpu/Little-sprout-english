# -*- coding: utf-8 -*-
"""Tạo ảnh nhỏ cho thẻ bộ đề ở trang chủ: img/<id>/thumb.webp (rộng 300px) từ p1ex.webp. Chạy lại được; bỏ qua bộ đã có và mới hơn."""
import os, cv2
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'img')
n = 0
for sid in sorted(os.listdir(IMG)):
    src = f'{IMG}/{sid}/p1ex.webp'; dst = f'{IMG}/{sid}/thumb.webp'
    if not os.path.exists(src): continue
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src): continue
    im = cv2.imread(src); h, w = im.shape[:2]; im = cv2.resize(im, (300, int(h * 300 / w)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(dst, im, [cv2.IMWRITE_WEBP_QUALITY, 72]); n += 1
tot = sum(os.path.getsize(f'{IMG}/{s}/thumb.webp') for s in os.listdir(IMG) if os.path.exists(f'{IMG}/{s}/thumb.webp'))
print('tạo', n, 'thumb; tổng', round(tot / 1024), 'KB')
