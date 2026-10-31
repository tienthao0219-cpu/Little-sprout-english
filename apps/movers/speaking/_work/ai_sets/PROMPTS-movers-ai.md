# Movers Speaking – 12 bộ soạn thêm (ai-t1 … ai-t12): prompt tạo ảnh cho ChatGPT

Cô tạo mỗi bộ **4 file ảnh**, đặt tên đúng như dưới đây rồi gửi cho Claude (hoặc để vào thư mục `ai_in`):

| File | Nội dung | Gợi ý tạo |
|---|---|---|
| `ai-tN_p1a.png` | Part 1 – tranh của cô (A) | tạo mới, tỉ lệ dọc 2:3 |
| `ai-tN_p1b.png` | Part 1 – tranh của em (B) | **gửi kèm ảnh A** rồi dán prompt B (nhờ ChatGPT sửa đúng 5 chỗ) |
| `ai-tN_p2.png` | Part 2 – 4 tranh kể chuyện (lưới 2×2) | tạo mới, 1 ảnh |
| `ai-tN_p3.png` | Part 3 – 4 bộ × 4 tranh (lưới 4×4) | tạo mới, 1 ảnh; nếu sai/thiếu tranh thì tạo từng hàng, đặt tên `ai-tN_p3_row1.png` … `row4.png` |

**Mẹo:** tạo trong cùng một cuộc trò chuyện cho mỗi bộ; nếu nhân vật Part 2 đổi mặt giữa các ô thì bảo ChatGPT 'giữ nguyên nhân vật'. Part 1: hai tranh phải **giống hệt** nhau trừ 5 chỗ ghi trong prompt B – kiểm tra kỹ vì chỗ khác thừa sẽ làm sai đáp án.
Hình không có chữ/số. Nếu ChatGPT vẽ chữ thì bảo vẽ lại không chữ.

---

## Bộ 1 – The park (`ai-t1`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here it's sunny, but here it's cloudy.”
- Part 1 – 4 điểm khác: red kite → blue kite; three ducks → two ducks; reading a book → eating an ice cream; bag on the bench → bag on the grass
- Part 2 – truyện “The lost balloon” (Anna (girl), Dad)
- Part 3 – bộ 1 (mẫu): an apple, a banana, an orange, a book → khác loại: a book
- Part 3 – bộ 2: a sandwich, a cake, a glass of milk, a pizza → khác loại: a glass of milk
- Part 3 – bộ 3: a dolphin, a whale, a shark, a horse → khác loại: a horse
- Part 3 – bộ 4: a woman buying bread, a girl painting, a boy painting, a man painting → khác loại: a woman buying bread
- Part 4 – chủ đề: your weekends

**Prompt ảnh Part 1 – tranh A** (`ai-t1_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a sunny park: a pond with three ducks on the left, a big tree in the middle, a bench with a girl in a yellow sweater reading a book, a boy on the right holding a red kite, a brown dog sitting under the tree, a woman with a pram on the path, a green bag on the bench. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t1_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: the sun becomes grey clouds
- Change 1: the boy's kite is blue instead of red.
- Change 2: two ducks in the pond instead of three.
- Change 3: the girl on the bench is eating an ice cream instead of reading a book.
- Change 4: the green bag is on the grass under the bench instead of on the bench.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t1_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Anna (girl), Dad. The story is called "The lost balloon".
Panel 1: Anna, a girl with a red balloon, holds her dad's hand in a sunny park. She is smiling.
Panel 2: A strong wind: the red balloon flies away into the sky. Anna looks up, sad. Dad is next to her.
Panel 3: The red balloon is stuck in a tall tree. Anna and Dad look up at it.
Panel 4: Dad is using a long stick to get the balloon from the tree. Anna is jumping and smiling.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t1_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): an apple; a banana; an orange; a book.
Row 2 (left to right): a sandwich; a cake; a glass of milk; a pizza.
Row 3 (left to right): a dolphin; a whale; a shark; a horse.
Row 4 (left to right): a woman buying bread; a girl painting; a boy painting; a man painting.
```

---

## Bộ 2 – The kitchen (`ai-t2`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there are two flowers on the window, but here there are three flowers.”
- Part 1 – 4 điểm khác: clock at 8 o'clock → clock at 9 o'clock; bananas → apples; drinking milk → drinking orange juice; cat on the chair → cat under the table
- Part 2 – truyện “Tom makes a cake” (Tom (boy), Mum)
- Part 3 – bộ 1 (mẫu): a dog, a cat, a chair, a rabbit → khác loại: a chair
- Part 3 – bộ 2: a shower, a bath, a bed, a toothbrush → khác loại: a bed
- Part 3 – bộ 3: a bowl of soup, a hot pizza, an ice cream, a cup of tea → khác loại: an ice cream
- Part 3 – bộ 4: a boy cooking, a girl cooking, a woman cooking, a man sleeping → khác loại: a man sleeping
- Part 4 – chủ đề: your home and food

**Prompt ảnh Part 1 – tranh A** (`ai-t2_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a family kitchen at breakfast: a round table with a mum, a dad and a boy eating; a yellow cooker with a pot; a window with two flowers on the sill; a clock on the wall showing 8 o'clock; a cat on a chair; a bowl of bananas on the table. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t2_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there are three flowers
- Change 1: the clock shows 9 o'clock instead of 8.
- Change 2: the bowl on the table has apples instead of bananas.
- Change 3: the boy is drinking orange juice instead of milk.
- Change 4: the cat is under the table instead of on the chair.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t2_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Tom (boy), Mum. The story is called "Tom makes a cake".
Panel 1: Tom, a boy, looks at a cookbook in the kitchen. Mum is next to him. A birthday card says 'Grandma' on the table.
Panel 2: Tom is putting eggs and flour in a big bowl. Mum is watching. There is a mess of flour.
Panel 3: Tom puts the cake in the oven. He is wearing an apron. Mum is smiling.
Panel 4: Tom is showing a big chocolate cake to Grandma. Grandma is happy and clapping.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t2_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a dog; a cat; a chair; a rabbit.
Row 2 (left to right): a shower; a bath; a bed; a toothbrush.
Row 3 (left to right): a bowl of soup; a hot pizza; an ice cream; a cup of tea.
Row 4 (left to right): a boy cooking; a girl cooking; a woman cooking; a man sleeping.
```

---

## Bộ 3 – The beach (`ai-t3`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here it's sunny, but here it's cloudy and a rainbow is in the sky.”
- Part 1 – 4 điểm khác: red boat → yellow boat; a flag on the sandcastle → no flag; green umbrella → blue umbrella; two seagulls → one seagull
- Part 2 – truyện “Lucy and the crab” (Lucy (girl), a crab)
- Part 3 – bộ 1 (mẫu): a hat, a fish, a scarf, a coat → khác loại: a fish
- Part 3 – bộ 2: a boy swimming, a girl swimming, a girl reading, a man swimming → khác loại: a girl reading
- Part 3 – bộ 3: a tiger, a lion, a zebra, a fish → khác loại: a fish
- Part 3 – bộ 4: a bus, a train, a plane, a bike → khác loại: a bike
- Part 4 – chủ đề: your holidays

**Prompt ảnh Part 1 – tranh A** (`ai-t3_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a sunny beach: blue sea with a red boat, a sandcastle with a flag on the left, a girl in a pink swimsuit with a red ball, a boy sitting on a yellow towel reading a comic, a man under a green umbrella, two seagulls flying, three shells on the sand. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t3_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: it's cloudy and a rainbow is in the sky
- Change 1: the boat is yellow instead of red.
- Change 2: the flag on the sandcastle is missing.
- Change 3: the umbrella is blue instead of green.
- Change 4: one seagull instead of two.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t3_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Lucy (girl), a crab. The story is called "Lucy and the crab".
Panel 1: Lucy, a girl in a hat, builds a sandcastle on the beach. A small crab watches from behind a rock.
Panel 2: The crab takes Lucy's red bucket and runs. Lucy points at it, surprised.
Panel 3: Lucy runs after the crab. The crab is going into the sea with the bucket.
Panel 4: Lucy is looking at the bucket on a rock, full of shells. The crab is waving from the water. Lucy laughs.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t3_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a hat; a fish; a scarf; a coat.
Row 2 (left to right): a boy swimming; a girl swimming; a girl reading; a man swimming.
Row 3 (left to right): a tiger; a lion; a zebra; a fish.
Row 4 (left to right): a bus; a train; a plane; a bike.
```

---

## Bộ 4 – The classroom (`ai-t4`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there is a map on the wall, but here there is a picture on the wall.”
- Part 1 – 4 điểm khác: long brown hair → short blonde hair; red bag → blue bag; wearing glasses → no glasses; a plant → flowers
- Part 2 – truyện “The missing pencil case” (Ben (boy), Miss Green (teacher))
- Part 3 – bộ 1 (mẫu): a library, a hospital, a sweater, a cinema → khác loại: a sweater
- Part 3 – bộ 2: a pencil, a ruler, a rubber, a rabbit → khác loại: a rabbit
- Part 3 – bộ 3: a kangaroo, a skirt, a sweater, a scarf → khác loại: a kangaroo
- Part 3 – bộ 4: a girl drawing, a boy writing, a girl reading, a boy kicking a ball → khác loại: a boy kicking a ball
- Part 4 – chủ đề: your school

**Prompt ảnh Part 1 – tranh A** (`ai-t4_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a classroom: a teacher with long brown hair writing on a green board, four children at desks, a world map on the left wall, a clock on the right wall, a red school bag on the floor, a plant on the teacher's desk, a boy with glasses at the front. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t4_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there is a picture on the wall
- Change 1: the teacher has short blonde hair instead of long brown hair.
- Change 2: the school bag is blue instead of red.
- Change 3: the boy at the front isn't wearing glasses.
- Change 4: the plant is a vase of flowers.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t4_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Ben (boy), Miss Green (teacher). The story is called "The missing pencil case".
Panel 1: Ben, a boy, looks in his school bag. His pencil case is not there. Other children are writing.
Panel 2: Ben looks under his desk and under the chair. Miss Green watches him.
Panel 3: A girl points to a blue pencil case on the teacher's desk. Ben is surprised.
Panel 4: Ben holds his pencil case, smiling. Miss Green and the class are laughing.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t4_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a library; a hospital; a sweater; a cinema.
Row 2 (left to right): a pencil; a ruler; a rubber; a rabbit.
Row 3 (left to right): a kangaroo; a skirt; a sweater; a scarf.
Row 4 (left to right): a girl drawing; a boy writing; a girl reading; a boy kicking a ball.
```

---

## Bộ 5 – The farm (`ai-t5`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there is a rainbow, but here there is a bird in the sky.”
- Part 1 – 4 điểm khác: red tractor → green tractor; three sheep → two sheep; brown horse → black horse; no hat → a hat
- Part 2 – truyện “The runaway sheep” (Peter (boy), a sheep)
- Part 3 – bộ 1 (mẫu): an apple, a banana, an orange, a book → khác loại: a book
- Part 3 – bộ 2: a cow, a horse, a sheep, a shark → khác loại: a shark
- Part 3 – bộ 3: a bird, a plane, a bat, a car → khác loại: a car
- Part 3 – bộ 4: an egg, cheese, milk, a tractor → khác loại: a tractor
- Part 4 – chủ đề: animals

**Prompt ảnh Part 1 – tranh A** (`ai-t5_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a farm: a red barn, a farmer in a blue shirt, a brown horse, three white sheep, two cows, a tractor, a green fence, four chickens near the barn, a rainbow in the sky. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t5_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there is a bird in the sky
- Change 1: the tractor is green instead of red.
- Change 2: two sheep instead of three.
- Change 3: the horse is black instead of brown.
- Change 4: the farmer is wearing a hat.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t5_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Peter (boy), a sheep. The story is called "The runaway sheep".
Panel 1: Peter, a boy on a farm, gives food to a white sheep in a field. The gate is open.
Panel 2: The sheep runs out of the open gate onto a road. Peter shouts and runs after it.
Panel 3: The sheep is in a garden eating flowers. A woman is angry and points at it.
Panel 4: Peter carries the sheep back to the farm. The woman waves. Peter is tired but happy.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t5_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): an apple; a banana; an orange; a book.
Row 2 (left to right): a cow; a horse; a sheep; a shark.
Row 3 (left to right): a bird; a plane; a bat; a car.
Row 4 (left to right): an egg; cheese; milk; a tractor.
```

---

## Bộ 6 – The shop (`ai-t6`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there is a woman behind the counter, but here there is a man behind the counter.”
- Part 1 – 4 điểm khác: red bag → yellow bag; a toy car → a teddy bear; apples → bananas; on the floor → on the counter
- Part 2 – truyện “Harry buys a present” (Harry (boy), Mum)
- Part 3 – bộ 1 (mẫu): a hat, a fish, a scarf, a coat → khác loại: a fish
- Part 3 – bộ 2: a sandwich, a hamburger, a pizza, a toothbrush → khác loại: a toothbrush
- Part 3 – bộ 3: a man buying a ticket, a woman buying a ticket, a boy buying a ticket, a girl eating an ice cream → khác loại: a girl eating an ice cream
- Part 3 – bộ 4: a shop, a school, a hospital, a swimming pool → khác loại: a swimming pool
- Part 4 – chủ đề: shopping

**Prompt ảnh Part 1 – tranh A** (`ai-t6_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a small shop: a woman shopkeeper with a green apron, a shelf with bread, a fridge with milk, a girl with a red bag buying apples, a boy with a toy car, a scale on the counter, a sign saying nothing (no words), a basket of oranges on the floor. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t6_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there is a man behind the counter
- Change 1: the girl's bag is yellow instead of red.
- Change 2: the boy has a teddy bear instead of a toy car.
- Change 3: there are bananas on the counter instead of apples.
- Change 4: the basket of oranges is on the counter instead of on the floor.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t6_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Harry (boy), Mum. The story is called "Harry buys a present".
Panel 1: Harry, a boy, holds some coins and looks at a poster with a birthday cake. Mum's birthday is circled on a calendar.
Panel 2: Harry is in a shop looking at a blue scarf and a red hat. The shopkeeper is helping him.
Panel 3: At the counter Harry gives coins to the shopkeeper. The scarf is in a bag. Harry is counting money.
Panel 4: At home Harry gives the scarf to Mum. She is surprised and happy.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t6_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a hat; a fish; a scarf; a coat.
Row 2 (left to right): a sandwich; a hamburger; a pizza; a toothbrush.
Row 3 (left to right): a man buying a ticket; a woman buying a ticket; a boy buying a ticket; a girl eating an ice cream.
Row 4 (left to right): a shop; a school; a hospital; a swimming pool.
```

---

## Bộ 7 – The zoo (`ai-t7`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there are two penguins, but here there are three penguins.”
- Part 1 – 4 điểm khác: green dress → purple dress; a bucket → a broom; red balloon → yellow balloon; standing → eating leaves
- Part 2 – truyện “Mia feeds the penguins” (Mia (girl), a zookeeper)
- Part 3 – bộ 1 (mẫu): a dog, a cat, a chair, a rabbit → khác loại: a chair
- Part 3 – bộ 2: a guitar, a piano, a violin, a monkey → khác loại: a monkey
- Part 3 – bộ 3: a boy playing football, a girl playing tennis, a boy playing basketball, a girl watching TV → khác loại: a girl watching TV
- Part 3 – bộ 4: a book, a magazine, a comic, a camera → khác loại: a camera
- Part 4 – chủ đề: hobbies

**Prompt ảnh Part 1 – tranh A** (`ai-t7_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a zoo: a pool with two penguins, a tall giraffe, an elephant, a girl in a green dress holding a map, a boy taking a photo, a zookeeper in a brown uniform with a bucket, a bin, a red balloon. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t7_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there are three penguins
- Change 1: the girl's dress is purple instead of green.
- Change 2: the zookeeper has a broom instead of a bucket.
- Change 3: the balloon is yellow instead of red.
- Change 4: the giraffe is eating leaves instead of standing.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t7_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Mia (girl), a zookeeper. The story is called "Mia feeds the penguins".
Panel 1: Mia, a girl, and a zookeeper stand next to a penguin pool. The zookeeper holds a bucket of fish.
Panel 2: The zookeeper gives Mia a fish. Penguins look at her from the water.
Panel 3: Mia throws the fish. A penguin jumps out of the water to catch it. Mia laughs.
Panel 4: Mia takes a photo with the penguins behind her. The zookeeper thumbs up.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t7_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a dog; a cat; a chair; a rabbit.
Row 2 (left to right): a guitar; a piano; a violin; a monkey.
Row 3 (left to right): a boy playing football; a girl playing tennis; a boy playing basketball; a girl watching TV.
Row 4 (left to right): a book; a magazine; a comic; a camera.
```

---

## Bộ 8 – The bus stop (`ai-t8`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here the woman is holding a blue umbrella, but here the woman isn't holding an umbrella and it's sunny.”
- Part 1 – 4 điểm khác: red bus → green bus; reading → eating a sandwich; yellow bag → red bag; skateboard → bike
- Part 2 – truyện “Ben misses the bus” (Ben (boy))
- Part 3 – bộ 1 (mẫu): a library, a hospital, a sweater, a cinema → khác loại: a sweater
- Part 3 – bộ 2: a bus, a train, a taxi, a kite → khác loại: a kite
- Part 3 – bộ 3: a bus, a taxi, a car, a boat → khác loại: a boat
- Part 3 – bộ 4: a girl going upstairs, a boy going upstairs, a man going upstairs, a woman going downstairs → khác loại: a woman going downstairs
- Part 4 – chủ đề: travel

**Prompt ảnh Part 1 – tranh A** (`ai-t8_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a town street: a red bus at a bus stop, a woman with a blue umbrella, a boy on a skateboard, a man reading a newspaper on a bench, a postbox, a cafe with a table outside, a girl with a yellow bag, a tall building with a clock. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t8_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: the woman isn't holding an umbrella and it's sunny
- Change 1: the bus is green instead of red.
- Change 2: the man is eating a sandwich instead of reading a newspaper.
- Change 3: the girl's bag is red instead of yellow.
- Change 4: the boy is riding a bike instead of a skateboard.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t8_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Ben (boy). The story is called "Ben misses the bus".
Panel 1: Ben, a boy with a backpack, is at a bus stop looking at his watch. A bus is leaving in the distance.
Panel 2: Ben runs after the bus. It is far away. He looks tired.
Panel 3: A woman in a car stops next to Ben and opens the window. Ben is surprised.
Panel 4: Ben is in the car. He is waving at the bus, which is behind them. The woman is smiling.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t8_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a library; a hospital; a sweater; a cinema.
Row 2 (left to right): a bus; a train; a taxi; a kite.
Row 3 (left to right): a bus; a taxi; a car; a boat.
Row 4 (left to right): a girl going upstairs; a boy going upstairs; a man going upstairs; a woman going downstairs.
```

---

## Bộ 9 – The campsite (`ai-t9`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there are three stars, but here there are two stars and a moon.”
- Part 1 – 4 điểm khác: blue tent → orange tent; a guitar → a violin; red jacket → green jacket; one canoe → two canoes
- Part 2 – truyện “The night noise” (Sam (boy), Zoe (girl))
- Part 3 – bộ 1 (mẫu): an apple, a banana, an orange, a book → khác loại: a book
- Part 3 – bộ 2: a tent, a torch, a backpack, a tiger → khác loại: a tiger
- Part 3 – bộ 3: a boy singing, a girl singing, a man singing, a woman cooking → khác loại: a woman cooking
- Part 3 – bộ 4: a sunny day, a hot day, a warm day, a snowy day → khác loại: a snowy day
- Part 4 – chủ đề: friends

**Prompt ảnh Part 1 – tranh A** (`ai-t9_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a campsite at sunset: a blue tent, a fire with a pot, a boy playing a guitar, a girl in a red jacket drinking from a cup, a big tree, a lake with a canoe, a backpack, three stars in the sky. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t9_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there are two stars and a moon
- Change 1: the tent is orange instead of blue.
- Change 2: the boy is playing a violin instead of a guitar.
- Change 3: the girl's jacket is green instead of red.
- Change 4: there are two canoes on the lake instead of one.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t9_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Sam (boy), Zoe (girl). The story is called "The night noise".
Panel 1: Sam and Zoe are in a tent at night with a torch. There is a full moon.
Panel 2: They hear a strange noise. Sam holds the torch, Zoe looks scared.
Panel 3: Sam opens the tent door. A big brown hedgehog is next to the tent eating an apple.
Panel 4: Zoe and Sam are laughing and giving the hedgehog more apples.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t9_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): an apple; a banana; an orange; a book.
Row 2 (left to right): a tent; a torch; a backpack; a tiger.
Row 3 (left to right): a boy singing; a girl singing; a man singing; a woman cooking.
Row 4 (left to right): a sunny day; a hot day; a warm day; a snowy day.
```

---

## Bộ 10 – The sports centre (`ai-t10`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there is one cloud, but here there are two clouds.”
- Part 1 – 4 điểm khác: white skirt → red skirt; black and white ball → orange ball; a cap → no cap; one bike → two bikes
- Part 2 – truyện “The big match” (Jack (boy))
- Part 3 – bộ 1 (mẫu): a hat, a fish, a scarf, a coat → khác loại: a fish
- Part 3 – bộ 2: a football, a tennis racket, a basketball, a banana → khác loại: a banana
- Part 3 – bộ 3: a boy swimming, a girl swimming, a boy diving, a girl skating → khác loại: a girl skating
- Part 3 – bộ 4: a doctor, a nurse, a dentist, a footballer → khác loại: a footballer
- Part 4 – chủ đề: sports

**Prompt ảnh Part 1 – tranh A** (`ai-t10_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a sports centre outdoors: a tennis court with a girl in a white skirt, a boy kicking a football, a coach with a whistle, a basketball hoop, a bike on the grass, a bottle of water on a bench, a blue sky with one cloud. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t10_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there are two clouds
- Change 1: the girl is wearing a red skirt instead of white.
- Change 2: the football is orange instead of black and white.
- Change 3: the coach is not wearing a cap.
- Change 4: there are two bikes instead of one.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t10_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Jack (boy). The story is called "The big match".
Panel 1: Jack, a boy in a blue football shirt, ties his boots in a changing room. His team is behind him.
Panel 2: Jack runs on a pitch with the ball. Players from the red team are close behind. People cheer.
Panel 3: Jack kicks the ball towards the goal. The goalkeeper jumps.
Panel 4: Jack and his team hold a silver cup and jump. They are very happy.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t10_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a hat; a fish; a scarf; a coat.
Row 2 (left to right): a football; a tennis racket; a basketball; a banana.
Row 3 (left to right): a boy swimming; a girl swimming; a boy diving; a girl skating.
Row 4 (left to right): a doctor; a nurse; a dentist; a footballer.
```

---

## Bộ 11 – The bedroom (`ai-t11`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there is a moon, but here there is a star.”
- Part 1 – 4 điểm khác: blue blanket → green blanket; 8 o'clock → 9 o'clock; on the bed → on the floor; five books → three books
- Part 2 – truyện “Grandma's story” (Lily (girl), Grandma)
- Part 3 – bộ 1 (mẫu): a dog, a cat, a chair, a rabbit → khác loại: a chair
- Part 3 – bộ 2: a bed, a pillow, a blanket, a bus → khác loại: a bus
- Part 3 – bộ 3: a boy getting up, a girl getting up, a man getting up, a woman sleeping → khác loại: a woman sleeping
- Part 3 – bộ 4: the moon, a star, a rocket, a whale → khác loại: a whale
- Part 4 – chủ đề: your evenings

**Prompt ảnh Part 1 – tranh A** (`ai-t11_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a child's bedroom in the evening: a single bed with a blue blanket and two pillows, a desk with a lamp and a laptop, a window with a moon outside, a bookshelf with five books, a teddy bear on the bed, a clock showing 8 o'clock, a rug with stripes. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t11_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there is a star
- Change 1: the blanket is green instead of blue.
- Change 2: the clock shows 9 o'clock instead of 8.
- Change 3: the teddy bear is on the floor instead of the bed.
- Change 4: three books on the bookshelf instead of five.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t11_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Lily (girl), Grandma. The story is called "Grandma's story".
Panel 1: Lily, a girl in pyjamas, brushes her teeth in a bathroom. Grandma stands in the doorway.
Panel 2: Lily is in bed. Grandma sits on a chair next to the bed holding a big book.
Panel 3: A picture of the story shows a dragon and a castle as a bubble above Lily. She is smiling.
Panel 4: Lily is asleep with a teddy bear. Grandma turns off the lamp and smiles.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t11_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a dog; a cat; a chair; a rabbit.
Row 2 (left to right): a bed; a pillow; a blanket; a bus.
Row 3 (left to right): a boy getting up; a girl getting up; a man getting up; a woman sleeping.
Row 4 (left to right): the moon; a star; a rocket; a whale.
```

---

## Bộ 12 – A party (`ai-t12`)

**Kế hoạch nội dung (để cô đối chiếu):**
- Part 1 – ví dụ giám khảo nói: “Here there are three balloons, but here there are four balloons.”
- Part 1 – 4 điểm khác: five candles → four candles; purple dress → yellow dress; no beard → a beard; a dog → a cat
- Part 2 – truyện “A surprise for Grandpa” (Emma (girl), Dad, Grandpa)
- Part 3 – bộ 1 (mẫu): a library, a hospital, a sweater, a cinema → khác loại: a sweater
- Part 3 – bộ 2: a cake, a candle, a balloon, a spoon → khác loại: a spoon
- Part 3 – bộ 3: a grandmother, a grandfather, a mother, a puppy → khác loại: a puppy
- Part 3 – bộ 4: a girl dancing, a boy dancing, a woman dancing, a man sitting → khác loại: a man sitting
- Part 4 – chủ đề: birthdays and family

**Prompt ảnh Part 1 – tranh A** (`ai-t12_p1a.png`)
```
Portrait 2:3 picture. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Scene: a birthday party in a living room: a table with a chocolate cake with five candles, a girl in a purple dress, a grandfather in a green jumper, three blue balloons, two presents, a dog under the table, a banner, a boy with a party hat blowing a horn. Show every object clearly and separated from the others, nothing cropped or hidden.
```

**Prompt ảnh Part 1 – tranh B** (`ai-t12_p1b.png`, gửi kèm ảnh A)
```
Using the attached picture A, create picture B. Keep the composition, characters, positions, colours, size and drawing style EXACTLY the same (it must look like the same picture with small edits). Change ONLY these five things and nothing else:
- Example change: there are four balloons
- Change 1: the cake has four candles instead of five.
- Change 2: the girl's dress is yellow instead of purple.
- Change 3: the grandfather has a beard.
- Change 4: there is a cat under the table instead of a dog.
```

**Prompt ảnh Part 2 – kể chuyện** (`ai-t12_p2.png`)
```
Landscape picture with four equal square panels in a 2x2 grid (panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right), each panel has a thin dark border and there is a white gap between panels. Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. Same characters in every panel (same faces, hair and clothes): Emma (girl), Dad, Grandpa. The story is called "A surprise for Grandpa".
Panel 1: Emma and Dad are hanging a banner and balloons in the living room. A big cake is on the table.
Panel 2: Grandpa opens the front door and looks surprised. Everybody shouts and jumps.
Panel 3: Grandpa blows out candles on the cake. Emma is clapping.
Panel 4: Grandpa gives Emma a big hug. He holds a small present. Everybody is smiling.
```

**Prompt ảnh Part 3 – odd one out** (`ai-t12_p3.png`)
```
Square picture with a grid of 4 rows x 4 columns = 16 equal square pictures, each in its own thin dark frame, white gaps between frames, every picture on a plain pastel background (one pastel colour per row). Children's English-exam illustration in the style of Cambridge Young Learners Movers: bright flat colours, clean dark outlines, friendly cartoon children and animals, simple uncluttered background. No text, no letters, no numbers, no speech bubbles, no watermark. One clear subject per picture, same style across all 16, subject big and centred.
Row 1 (left to right): a library; a hospital; a sweater; a cinema.
Row 2 (left to right): a cake; a candle; a balloon; a spoon.
Row 3 (left to right): a grandmother; a grandfather; a mother; a puppy.
Row 4 (left to right): a girl dancing; a boy dancing; a woman dancing; a man sitting.
```

---
