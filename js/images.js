/* Hình riêng cho từng câu / từng từ
   - IMG: <emoji | tên từ | đường dẫn ảnh>  (đặt ngay trước câu hỏi, xem cú pháp trong trình soạn bài)
   - "tên từ" được tra trong THƯ VIỆN HÌNH của cô (ảnh cô tải lên); nếu chưa có ảnh thì dùng emoji gợi ý (nếu có)
   - Emoji gợi ý chỉ là hình minh hoạ chung cho từ cụ thể (con vật, đồ ăn, đồ vật...). Không lấy nội dung từ sách giáo khoa. */
(function (L) {
  const { h } = L;
  const RAW = `
dog 🐶,puppy 🐶,cat 🐱,kitten 🐱,mouse 🐭,rabbit 🐰,bird 🐦,fish 🐟,duck 🦆,chicken 🐔,hen 🐔,rooster 🐓,cow 🐮,pig 🐷,horse 🐴,sheep 🐑,goat 🐐,elephant 🐘,monkey 🐵,tiger 🐯,lion 🦁,bear 🐻,panda 🐼,zebra 🦓,giraffe 🦒,snake 🐍,frog 🐸,turtle 🐢,butterfly 🦋,bee 🐝,ant 🐜,spider 🕷️,crocodile 🐊,kangaroo 🦘,dolphin 🐬,whale 🐳,shark 🦈,octopus 🐙,crab 🦀,penguin 🐧,owl 🦉,parrot 🦜,camel 🐫,deer 🦌,fox 🦊,wolf 🐺,squirrel 🐿️,dinosaur 🦕,dragon 🐉,ladybird 🐞,ladybug 🐞,snail 🐌,worm 🐛,hippo 🦛,hippopotamus 🦛,rhino 🦏,rhinoceros 🦏,swan 🦢,eagle 🦅,peacock 🦚,flamingo 🦩,lizard 🦎,gorilla 🦍,hedgehog 🦔,
apple 🍎,banana 🍌,orange 🍊,grape 🍇,strawberry 🍓,watermelon 🍉,pineapple 🍍,mango 🥭,lemon 🍋,peach 🍑,pear 🍐,cherry 🍒,coconut 🥥,kiwi 🥝,tomato 🍅,potato 🥔,carrot 🥕,corn 🌽,onion 🧅,garlic 🧄,broccoli 🥦,cucumber 🥒,mushroom 🍄,bread 🍞,cheese 🧀,egg 🥚,milk 🥛,rice 🍚,noodle 🍜,pizza 🍕,hamburger 🍔,burger 🍔,sandwich 🥪,hot dog 🌭,french fries 🍟,fries 🍟,cake 🎂,cookie 🍪,biscuit 🍪,ice cream 🍦,chocolate 🍫,candy 🍬,popcorn 🍿,juice 🧃,water 💧,tea 🍵,coffee ☕,soup 🍲,meat 🥩,pancake 🥞,honey 🍯,salad 🥗,butter 🧈,sushi 🍣,spaghetti 🍝,curry 🍛,bacon 🥓,donut 🍩,doughnut 🍩,lollipop 🍭,
book 📖,books 📚,pen 🖊️,pencil ✏️,ruler 📏,bag 🎒,schoolbag 🎒,backpack 🎒,scissors ✂️,notebook 📓,computer 💻,laptop 💻,clock 🕐,globe 🌍,map 🗺️,school 🏫,teacher 🧑‍🏫,student 🧑‍🎓,chair 🪑,paper 📄,library 📚,music 🎵,art 🎨,paint 🎨,calendar 📅,bell 🔔,microscope 🔬,telescope 🔭,
house 🏠,home 🏠,hospital 🏥,bank 🏦,post office 🏤,shop 🏪,store 🏪,supermarket 🏬,restaurant 🍽️,hotel 🏨,church ⛪,castle 🏰,park 🏞️,beach 🏖️,mountain ⛰️,sea 🌊,island 🏝️,forest 🌲,desert 🏜️,city 🏙️,village 🏘️,bridge 🌉,factory 🏭,station 🚉,cinema 🎬,museum 🏛️,stadium 🏟️,tent ⛺,volcano 🌋,
car 🚗,bus 🚌,bike 🚲,bicycle 🚲,motorbike 🏍️,motorcycle 🏍️,train 🚆,plane ✈️,airplane ✈️,boat ⛵,ship 🚢,helicopter 🚁,taxi 🚕,truck 🚚,tractor 🚜,rocket 🚀,ambulance 🚑,fire engine 🚒,scooter 🛴,subway 🚇,tram 🚊,cable car 🚡,traffic light 🚦,
eye 👁️,ear 👂,nose 👃,mouth 👄,hand ✋,foot 🦶,leg 🦵,arm 💪,tooth 🦷,teeth 🦷,tongue 👅,heart ❤️,brain 🧠,bone 🦴,
baby 👶,boy 👦,girl 👧,man 👨,woman 👩,mother 👩,mom 👩,mum 👩,father 👨,dad 👨,grandmother 👵,grandma 👵,grandfather 👴,grandpa 👴,family 👨‍👩‍👧‍👦,doctor 🧑‍⚕️,nurse 🧑‍⚕️,policeman 👮,police officer 👮,firefighter 🧑‍🚒,farmer 🧑‍🌾,cook 🧑‍🍳,chef 🧑‍🍳,pilot 🧑‍✈️,astronaut 🧑‍🚀,artist 🧑‍🎨,singer 🧑‍🎤,scientist 🧑‍🔬,king 🤴,queen 👸,prince 🤴,princess 👸,clown 🤡,ghost 👻,robot 🤖,alien 👽,
shirt 👕,t-shirt 👕,dress 👗,jeans 👖,trousers 👖,pants 👖,shoe 👟,boot 🥾,sock 🧦,cap 🧢,coat 🧥,jacket 🧥,scarf 🧣,glove 🧤,glasses 👓,sunglasses 🕶️,umbrella ☂️,watch ⌚,ring 💍,crown 👑,tie 👔,
sun ☀️,moon 🌙,star ⭐,cloud ☁️,rain 🌧️,snow ❄️,wind 💨,storm ⛈️,rainbow 🌈,lightning ⚡,fire 🔥,tree 🌳,flower 🌸,rose 🌹,leaf 🍃,sunflower 🌻,earth 🌍,planet 🪐,
bed 🛏️,sofa 🛋️,couch 🛋️,door 🚪,window 🪟,lamp 💡,light bulb 💡,key 🔑,television 📺,tv 📺,phone 📱,telephone ☎️,radio 📻,camera 📷,bath 🛁,shower 🚿,toilet 🚽,mirror 🪞,candle 🕯️,broom 🧹,toothbrush 🪥,soap 🧼,plate 🍽️,fork 🍴,knife 🔪,spoon 🥄,bowl 🥣,box 📦,gift 🎁,present 🎁,balloon 🎈,kite 🪁,ball ⚽,teddy bear 🧸,puzzle 🧩,guitar 🎸,piano 🎹,drum 🥁,violin 🎻,trumpet 🎺,microphone 🎤,headphone 🎧,
football ⚽,soccer ⚽,basketball 🏀,baseball ⚾,tennis 🎾,volleyball 🏐,badminton 🏸,table tennis 🏓,swimming 🏊,cycling 🚴,skiing ⛷️,skating ⛸️,golf ⛳,boxing 🥊,fishing 🎣,medal 🏅,trophy 🏆,chess ♟️,
money 💰,coin 🪙,flag 🚩,ticket 🎫,lock 🔒,letter ✉️,email ✉️,newspaper 📰,game 🎮,video game 🎮,
red 🔴,blue 🔵,green 🟢,yellow 🟡,purple 🟣,brown 🟤,black ⚫,white ⚪`;
  const DICT = {};
  RAW.split(",").forEach(e => { const t = e.trim(); if (!t) return; const i = t.search(/\s[^\s]+$/); const w = t.slice(0, i).trim().toLowerCase(), em = t.slice(i).trim(); if (w && em) DICT[w] = em; });

  const IMG_EXT = /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i;
  const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|️|‍|[\u{1F1E6}-\u{1F1FF}]|⃣)+$/u;
  const isEmoji = s => { s = String(s || "").trim(); return !!s && EMOJI_ONLY.test(s) && /\p{Extended_Pictographic}/u.test(s); };
  const clean = w => String(w || "").toLowerCase().replace(/^\s*(?:a|an|the|some)\s+/, "").replace(/[^\p{L}\p{N}'\- ]+/gu, " ").replace(/\s+/g, " ").trim();

  /** emoji gợi ý cho một từ tiếng Anh (xử lý số nhiều đơn giản); không có thì trả "" */
  function emojiFor(word) {
    const w = clean(word); if (!w) return "";
    if (DICT[w]) return DICT[w];
    const forms = [];
    if (/ies$/.test(w)) forms.push(w.replace(/ies$/, "y"));
    if (/(ches|shes|xes|ses|zes|oes)$/.test(w)) forms.push(w.replace(/es$/, ""));
    if (/s$/.test(w)) forms.push(w.replace(/s$/, ""));
    if (/^(.*)\s(\S+)$/.test(w)) { const m = w.match(/^(.*)\s(\S+)$/); forms.push(m[2]); }
    for (const f of forms) if (DICT[f]) return DICT[f];
    return "";
  }

  const imgs = {
    map: null, _p: null, DICT, isEmoji, emojiFor,
    /** tải danh mục hình (data/images.json). Gọi nhiều lần vẫn chỉ tải một lần trừ khi force */
    load(force) {
      if (imgs._p && !force) return imgs._p;
      imgs._p = fetch("data/images.json?v=" + Date.now(), { cache: "no-store" })
        .then(r => r.ok ? r.json() : { images: {} }).catch(() => ({ images: {} }))
        .then(j => { imgs.map = (j && j.images) || {}; return imgs.map; });
      return imgs._p;
    },
    setMap(m) { imgs.map = m; imgs._p = Promise.resolve(m); },
    /** -> {k:'img',src,word} | {k:'emoji',e,word} | null */
    resolve(v) {
      v = String(v == null ? "" : v).trim(); if (!v) return null;
      if (isEmoji(v)) return { k: "emoji", e: v, word: "" };
      if (/^(https?:|data:image\/|\.{0,2}\/?assets\/)/i.test(v) || IMG_EXT.test(v)) return { k: "img", src: v, word: v.replace(/^.*\//, "").replace(/\.\w+(\?.*)?$/, "") };
      const key = L.slug(clean(v)), m = imgs.map || {};
      if (m[key]) return { k: "img", src: m[key], word: v };
      const e = emojiFor(v); if (e) return { k: "emoji", e, word: v };
      return null;
    },
    /** nút hình để chèn vào câu hỏi; null nếu không tìm được */
    node(v) {
      const r = imgs.resolve(v); if (!r) return null;
      return r.k === "img" ? h("img.qimg", { src: r.src, alt: r.word || "", loading: "lazy" }) : h("div.qemoji", { role: "img", "aria-label": r.word || "" }, r.e);
    },
    /** chữ mô tả để ghi vào báo cáo câu sai */
    text(v) { const r = imgs.resolve(v); return r ? (r.word || r.e || "") : String(v || ""); },

    /** gợi ý emoji cho từng câu của một phần (chèn dòng IMG: vào đầu mỗi khối chưa có hình). Trả {raw, added, total} */
    suggest(type, raw) {
      const text = String(raw || "").replace(/\r/g, "").trim();
      if (!text) return { raw: "", added: 0, total: 0 };
      const supported = ["mcq1", "mcqN", "fill", "fillhint", "fillbank", "fillchoose", "short"];
      if (!supported.includes(type)) return { raw: text, added: 0, total: 0, unsupported: true };
      const lineBased = type === "short" || (type.startsWith("fill") && !/\n\s*\n/.test(text));
      const blocks = lineBased ? text.split("\n").filter(l => l.trim()).map(l => [l]) : text.split(/\n\s*\n/).map(b => b.split("\n"));
      let added = 0, total = 0; const IMGL = /^\s*(?:IMG|HÌNH|HINH|PIC)\s*[:：]/i;
      const out = blocks.map(b => {
        if (b.every(l => /^\s*(?:BANK|KHUNG TỪ|KHUNG TU)\s*[:：]/i.test(l))) return b.join("\n");
        total++;
        if (b.some(l => IMGL.test(l))) return b.join("\n");
        let cands = [];
        if (type === "short") { const l = b[0], k = l.indexOf("=>"); if (k >= 0) cands = l.slice(k + 2).split("/"); }
        else if (type.startsWith("fill")) {
          const re = /\[\[(.+?)\]\]/g; let m; const s = b.join(" ");
          while ((m = re.exec(s))) { const c = m[1]; cands = cands.concat(c.includes("|") ? c.split("|").filter(x => x.trim().startsWith("*")).map(x => x.replace(/^\s*\*\s*/, "")) : c.split("/")); }
        } else {
          b.forEach(l => { const m = l.match(/^\s*(\*)?\s*\(?[A-Ha-h][\.\)]\s+(.*\S)\s*$/); if (m && (m[1] || /\*\s*$/.test(m[2]))) cands.push(m[2].replace(/\s*\*\s*$/, "")); });
        }
        let e = ""; for (const c of cands) { e = emojiFor(c); if (e) break; }
        if (!e) return b.join("\n");
        added++; return "IMG: " + e + "\n" + b.join("\n");
      });
      return { raw: out.join(lineBased ? "\n" : "\n\n"), added, total };
    }
  };
  L.imgs = imgs;
})(window.LSE);
