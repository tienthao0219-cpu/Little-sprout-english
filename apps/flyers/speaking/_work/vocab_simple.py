# Thay từ khó trong gợi ý Part 3 (và vài câu chuyện mẫu) bằng từ cơ bản, giữ nguyên ý của tranh.
import json,re
P='data.json'; d=json.load(open(P,encoding='utf8'))
M={ # english (lowercase) -> (english, tiếng Việt)
 'pleased':('happy','vui'),'grateful':('happy','vui'),'relieved':('happy','vui'),'relaxed':('happy','vui'),'calm':('happy','vui'),
 'confused':('worried','lo lắng'),'nervous':('worried','lo lắng'),'curious':('surprised','ngạc nhiên'),'shocked':('surprised','ngạc nhiên'),
 'careless':('sad','buồn'),'lonely':('sad','buồn'),'interested':('excited','hào hứng'),
 'kneel':('sit down','ngồi xuống'),'kneel down':('sit down','ngồi xuống'),
 'pour flour':('put flour in the bowl','cho bột vào tô'),'press a button':('push a button','ấn nút'),
 'say "shh"':('say "Be quiet"','nói "Giữ yên lặng"'),'sweep':('clean the floor','lau sàn'),'splash':('play in the water','chơi nước'),
 'the sun shines':("it's sunny",'trời nắng'),'touch the ribbon':('touch the line','chạm vạch đích'),'under the banner':('under the sign','dưới tấm biển'),
 'hold the lead':('hold the rope','cầm dây dắt'),'go downstairs':('go down the stairs','đi xuống cầu thang'),'lie in bed':('be in bed','nằm trên giường'),
 'on the pavement':('on the street','trên đường phố'),'next to the tree trunk':('next to the big tree','cạnh cây lớn'),
 'in front of the wooden cabin':('in front of the wooden house','trước căn nhà gỗ'),'near the cabin':('near the house','gần căn nhà'),
 'next to the rack':('next to the clothes','cạnh quần áo'),'next to the stall':('next to the shop','cạnh cửa hàng nhỏ'),
 'the dark shape':('the shadow','cái bóng đen'),'pack a picnic basket':('put food in the basket','bỏ đồ ăn vào giỏ'),
 'pack the basket':('put things in the basket','bỏ đồ vào giỏ'),'mix the cake':('make the cake','làm bánh'),
}
n=0
for s in d['sets']:
  for c in (s.get('p3c') or []):
    for k in 'slvf':
      if not c.get(k): continue
      out=[];seen=set()
      for part in c[k].split(';'):
        part=part.strip()
        if ' = ' in part:
          en,vi=part.split(' = ',1); key=en.strip().lower()
          if key in M: en,vi=M[key]; n+=1
          part=f'{en} = {vi}'
        key=part.split(' = ')[0].lower()
        if key in seen: continue
        seen.add(key); out.append(part)
      c[k]='; '.join(out)
SR=[(r'\bThey? come in quietly\b','They come in'),(r'Her friends come in quietly\.','Her friends come in.'),
    (r'Tom sweeps and Kim picks up','Tom cleans the floor and Kim picks up'),(r'He goes downstairs\.','He goes down the stairs.'),
    (r'are shocked\.','are surprised.')]
for s in d['sets']:
  if s.get('story'):
    s['story']=[ (lambda t:[t:=re.sub(a,b,t) for a,b in SR][-1])(t) for t in s['story']]
open(P,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=0))
print('thay',n,'cụm')
