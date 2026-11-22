/**
 * LITTLE SPROUT ENGLISH — máy chủ lưu dữ liệu (Google Apps Script)
 *
 * Cách dùng: tạo một Google Sheet mới -> Tiện ích mở rộng -> Apps Script -> dán toàn bộ file này.
 * Sau đó làm theo HUONG-DAN.md (bước 3). Mật khẩu đặt ở hai hằng số ngay bên dưới.
 */

// ====== ĐỔI HAI MẬT KHẨU NÀY TRƯỚC KHI TRIỂN KHAI ======
const STUDENT_PASSWORD = 'DOI-MAT-KHAU-LOP';      // mật khẩu chung cho học viên
const TEACHER_PASSWORD = 'DOI-MAT-KHAU-CO';       // mật khẩu của cô
const TEACHER_NAME = 'Miss Thảo';
// =========================================================

const SHEETS = {
  plays: ['sid', 'time', 'updated', 'name', 'appId', 'appTitle', 'cur', 'unit', 'attempt', 'score', 'max', 'pct', 'durationSec'],
  // sec/no/ans/key (thêm sau): phần nào, câu số mấy, em chọn gì, đáp án đúng -> báo cáo chi tiết từng bài nộp
  answers: ['time', 'name', 'source', 'sourceId', 'attempt', 'topic', 'qid', 'ok', 'q', 'sec', 'no', 'ans', 'key'],
  homework: ['id', 'title', 'curId', 'unitId', 'open', 'created', 'updated', 'meta', 'fileId'],
  submissions: ['time', 'name', 'hwId', 'hwTitle', 'attempt', 'score', 'max', 'scaled', 'durationSec'],
  students: ['name', 'code', 'active', 'created', 'note'],
  appAssign: ['appId', 'names', 'updated'],
  profiles: ['name', 'data', 'updated'],
  // Chấm Speaking bằng AI: cấu hình từng bài + kết quả đã chấm (data = JSON)
  spgLessons: ['id', 'title', 'data', 'updated'],
  spgResults: ['id', 'time', 'student', 'lessonId', 'lessonTitle', 'total', 'band', 'durationSec', 'data', 'status']
};
const MAX_REPORT_ANSWERS = 8000;
const DETAIL_COLS = ['sec', 'no', 'ans', 'key'];   // cột nặng: không gửi trong 'report' tổng hợp, chỉ gửi khi xem chi tiết 1 bài nộp (hwDetail)

const READ_ONLY = {
  login: 1, myPlays: 1, report: 1, hwDetail: 1, studentList: 1, profileGet: 1, profileList: 1, appAccess: 1, appAssignList: 1,
  hwList: 1, hwGet: 1, hwMine: 1, hwResults: 1, spgInfo: 1, spgLessonList: 1, spgResultList: 1, spgResultGet: 1
};

function doGet() {
  return json_({ ok: true, service: 'Little Sprout English', note: 'Dùng POST. Mở trang web của lớp để sử dụng.' });
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Dữ liệu gửi lên không hợp lệ' }); }
  // Chấm Speaking gọi Gemini mất 20-60 giây: KHÔNG giữ khoá chung, nếu không mọi học viên khác phải chờ theo
  if (body.action === 'spgGrade') {
    try { return json_(spgGrade_(body)); } catch (err) { return json_({ ok: false, error: String(err && err.message || err) }); }
  }
  // AI soạn bài tập từ ảnh cũng gọi Gemini (20-90 giây): xử lý riêng, không giữ khoá chung
  if (body.action === 'hwAi') {
    try { return json_(hwAi_(body)); } catch (err) { return json_({ ok: false, error: String(err && err.message || err) }); }
  }
  // Thao tác CHỈ ĐỌC (đăng nhập, xem danh sách, báo cáo...) không giữ khoá chung -> không phải xếp hàng sau các lượt ghi
  if (READ_ONLY[body.action] === 1) {
    try { return json_(route_(body)); } catch (err) { return json_({ ok: false, error: String(err && err.message || err) }); }
  }
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    return json_(route_(body));
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) { }
  }
}

function route_(b) {
  const a = auth_(b);
  if (b.action === 'login') {
    if (!a) throw new Error(rosterOn_() ? 'Tên hoặc mật khẩu chưa đúng. Em kiểm tra lại nhé.' : 'Sai mật khẩu');
    if (a.role === 'student' && !a.name) throw new Error('Nhập tên của em nhé');
    return { ok: true, role: a.role, name: a.name, roster: rosterOn_() };
  }
  if (!a) throw new Error('Sai mật khẩu hoặc phiên đã hết hạn');
  const teacher = a.role === 'teacher';
  const needT = function () { if (!teacher) throw new Error('Chỉ dành cho cô giáo'); };
  // Tên luôn lấy từ danh sách học viên (không tin tên do trình duyệt gửi) -> em này không xem được dữ liệu của em khác
  const name = a.name;

  switch (b.action) {
    case 'logPlay': return logPlay_(name, b.play, b.answers);
    case 'myPlays': return {
      ok: true,
      plays: rows_('plays').filter(function (r) { return r.name === name; }).slice(-200).reverse(),
      subs: rows_('submissions').filter(function (r) { return r.name === name; }).slice(-200).reverse()
    };
    case 'report': needT(); return {
      ok: true,
      plays: rows_('plays'),
      subs: rows_('submissions'),
      answers: rowsTail_('answers', MAX_REPORT_ANSWERS).map(function (r) { DETAIL_COLS.forEach(function (c) { if (r.source === 'app' && (c === 'ans' || c === 'key')) return; delete r[c]; }); return r; })   // app: giữ ans/key (nhẹ, chỉ có khi sai)
    };
    // Chi tiết từng câu của MỘT bài nộp (phần, câu, đáp án em chọn, đáp án đúng)
    case 'hwDetail': needT(); return {
      ok: true,
      answers: hwAnswers_(b.id, b.student, b.attempt)
    };
    case 'studentList': needT(); return { ok: true, roster: rosterOn_(), list: students_().map(function (r) { return { name: String(r.name), code: String(r.code), active: isTrue_(r.active), note: String(r.note || '') }; }) };
    case 'studentSave': needT(); return studentsUpsert_(b.list || [], b.oldName);
    case 'studentDelete': needT(); return studentDelete_(b.name);
    case 'profileGet': return profileGet_(name);
    case 'profileSave': return profileSave_(name, b);
    case 'profileList': needT(); return profileList_();
    case 'appAccess': return appAccess_(name, teacher);
    case 'appAssignList': needT(); return { ok: true, list: rows_('appAssign').map(function (r) { return { appId: r.appId, names: parseArr_(r.names) }; }) };
    case 'appAssignSave': needT(); return appAssignSave_(b.appId, b.names);
    case 'hwSave': needT(); return hwSave_(b.hw);
    case 'hwList': return hwList_(name, teacher);
    case 'hwGet': return hwGet_(b.id, teacher, name);
    case 'hwSubmit': return hwSubmit_(name, b, teacher);
    case 'hwMine': return { ok: true, subs: rows_('submissions').filter(function (r) { return r.hwId === b.id && r.name === name; }) };
    case 'hwResults': needT(); return { ok: true, subs: rows_('submissions').filter(function (r) { return r.hwId === b.id; }) };
    case 'hwDelete': needT(); return hwDelete_(b.id);
    case 'hwSetOpen': needT(); return hwSetOpen_(b.id, !!b.open);
    // Chấm Speaking bằng AI (spgGrade xử lý riêng ở doPost)
    case 'spgInfo': needT(); return { ok: true, hasKey: !!spgProps_().getProperty('GEMINI_API_KEY'), model: String(spgProps_().getProperty('GEMINI_MODEL') || SPG_DEFAULT_MODEL) };
    case 'spgLessonList': needT(); return spgLessonList_();
    case 'spgLessonSave': needT(); return spgLessonSave_(b.lesson);
    case 'spgLessonDelete': needT(); spgLessonDelete_(cut_(b.id, 40)); return { ok: true };
    case 'spgLessonCleanup': needT(); return spgLessonCleanup_();
    case 'spgSettingsSave': needT(); return spgSettingsSave_(b.settings);
    case 'spgResultSave': needT(); return spgResultSave_(b.result);
    case 'spgResultList': needT(); return spgResultList_();
    case 'spgResultGet': needT(); return spgResultGet_(b.id);
    case 'spgResultDelete': needT(); deleteRow_('spgResults', 'id', cut_(b.id, 40)); return { ok: true };
  }
  throw new Error('Hành động không hợp lệ: ' + b.action);
}

/* ---------- đăng nhập & tài khoản học viên ---------- */
function key_(s) { return String(s == null ? '' : s).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim(); }
/** so tên không phân biệt hoa/thường và dấu tiếng Việt */
function plain_(s) { return key_(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
function sameName_(a, b) { return !!plain_(a) && plain_(a) === plain_(b); }
function isTrue_(v) { return v === true || String(v).toUpperCase() === 'TRUE'; }
function parseArr_(s) { try { const a = JSON.parse(s || '[]'); return Array.isArray(a) ? a.map(String) : []; } catch (e) { return []; } }
let STUDENTS_MEMO_ = null;
const STUDENTS_CACHE_KEY = 'students_v1', STUDENTS_CACHE_SEC = 120;
/** danh sách học viên: nhớ trong lượt chạy + bộ nhớ đệm 2 phút (fresh=true: đọc thẳng từ Sheet, dùng khi sắp GHI) */
function students_(fresh) {
  if (!fresh && STUDENTS_MEMO_) return STUDENTS_MEMO_;
  if (!fresh) {
    try { const c = CacheService.getScriptCache().get(STUDENTS_CACHE_KEY); if (c) { STUDENTS_MEMO_ = JSON.parse(c); return STUDENTS_MEMO_; } } catch (e) { }
  }
  const list = rows_('students');
  STUDENTS_MEMO_ = list;
  try { CacheService.getScriptCache().put(STUDENTS_CACHE_KEY, JSON.stringify(list), STUDENTS_CACHE_SEC); } catch (e) { }
  return list;
}
function studentsChanged_() { STUDENTS_MEMO_ = null; try { CacheService.getScriptCache().remove(STUDENTS_CACHE_KEY); } catch (e) { } }
/** Có ít nhất 1 học viên đang hoạt động trong danh sách = bật chế độ "mỗi em một mật khẩu riêng" */
function rosterOn_() { return students_().some(function (r) { return isTrue_(r.active); }); }

function auth_(b) {
  const pw = String(b.pw || '').trim();
  if (!pw) return null;
  if (pw === TEACHER_PASSWORD) return { role: 'teacher', name: String(b.name || '').trim() || TEACHER_NAME };
  const act = students_().filter(function (r) { return isTrue_(r.active); });
  const nm = String(b.name || '').trim();
  if (act.length) {
    for (let i = 0; i < act.length; i++) {
      if (nm && sameName_(act[i].name, nm) && key_(act[i].code) === key_(pw)) return { role: 'student', name: String(act[i].name) };
    }
    return null;
  }
  if (pw === STUDENT_PASSWORD) return { role: 'student', name: nm };
  return null;
}

/** items: [{name, code, active, note}]; oldName: đổi tên 1 học viên đang có */
function studentsUpsert_(items, oldName) {
  if (!Array.isArray(items) || !items.length) throw new Error('Chưa có học viên nào để lưu');
  if (items.length > 200) throw new Error('Mỗi lần lưu tối đa 200 học viên');
  const sh = sheet_('students'), cols = SHEETS.students;
  studentsChanged_();
  const all = students_(true);
  const now = new Date().toISOString();
  const seen = {};
  items.forEach(function (it, idx) {
    const nm = String(it.name || '').trim().replace(/\s+/g, ' ');
    const code = String(it.code || '').trim();
    if (!nm || nm.length > 60) throw new Error('Tên học viên không được để trống (tối đa 60 ký tự)');
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{3,29}$/.test(code)) throw new Error('Mật khẩu của "' + nm + '" cần 4-30 ký tự, chỉ gồm chữ không dấu, số, gạch nối hoặc gạch dưới');
    if (code === TEACHER_PASSWORD) throw new Error('Mật khẩu của "' + nm + '" trùng mật khẩu của cô, hãy đặt khác');
    if (seen[plain_(nm)]) throw new Error('Tên "' + nm + '" bị trùng trong danh sách. Hãy thêm chữ phân biệt (ví dụ "An A", "An B")');
    seen[plain_(nm)] = true;
    it._nm = nm; it._code = code;
  });
  items.forEach(function (it, idx) {
    // tìm dòng hiện có: theo tên cũ (nếu đổi tên) hoặc theo tên mới
    let rowIdx = -1;
    const target = idx === 0 && oldName ? oldName : it._nm;
    for (let i = 0; i < all.length; i++) { if (sameName_(all[i].name, target)) { rowIdx = i + 2; break; } }
    if (rowIdx < 0 && idx === 0 && oldName) { for (let i = 0; i < all.length; i++) { if (sameName_(all[i].name, it._nm)) { rowIdx = i + 2; break; } } }
    // không cho đổi tên thành tên của người khác
    if (idx === 0 && oldName) {
      for (let i = 0; i < all.length; i++) { if (sameName_(all[i].name, it._nm) && !sameName_(all[i].name, oldName)) throw new Error('Đã có học viên tên "' + it._nm + '"'); }
    }
    const active = it.active === undefined ? true : !!it.active;
    const rowVals = [safe_(it._nm), it._code, active, rowIdx > 0 ? all[rowIdx - 2].created : now, safe_(cut_(it.note, 200))];
    if (rowIdx > 0) {
      sh.getRange(rowIdx, 1, 1, cols.length).setValues([rowVals]);
      all[rowIdx - 2] = { name: rowVals[0], code: rowVals[1], active: active, created: rowVals[3], note: rowVals[4] };
    } else {
      sh.appendRow(rowVals);
      all.push({ name: rowVals[0], code: rowVals[1], active: active, created: now, note: rowVals[4] });
    }
  });
  studentsChanged_();
  return { ok: true, count: items.length };
}
function studentDelete_(name) {
  const sh = sheet_('students'), n = sh.getLastRow();
  if (n < 2) return { ok: true };
  const vals = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) if (sameName_(vals[i][0], name)) sh.deleteRow(i + 2);
  studentsChanged_();
  return { ok: true };
}


/* ---------- hồ sơ học viên: xu, avatar, thú nuôi, nhiệm vụ... (mỗi em một dòng trong trang tính "profiles") ---------- */
const PROFILE_MAX_BYTES = 45000;
const MAX_COIN_DELTA = 400;   // mỗi lần đồng bộ, số xu tăng thêm tối đa (chặn gian lận kiểu sửa số xu bằng F12)
function profileRow_(name) {
  const sh = sheet_('profiles'), n = sh.getLastRow();
  if (n < 2) return null;
  // chỉ đọc cột tên để tìm dòng, rồi mới đọc dữ liệu của ĐÚNG 1 dòng (cột data của cả lớp có thể nặng hàng MB)
  const names = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < names.length; i++) {
    if (sameName_(names[i][0], name)) {
      const v = sh.getRange(i + 2, 1, 1, 3).getValues()[0];
      return { sh: sh, row: i + 2, data: parseObj_(v[1]) };
    }
  }
  return null;
}
function parseObj_(s) { try { const o = JSON.parse(s || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } }
function profileGet_(name) {
  if (!name) return { ok: true, profile: null };
  const f = profileRow_(name);
  return { ok: true, profile: f ? f.data : null };
}
function unionArr_(a, b, max) {
  const out = [];
  (Array.isArray(a) ? a : []).concat(Array.isArray(b) ? b : []).forEach(function (x) { x = String(x).slice(0, 40); if (out.indexOf(x) < 0 && out.length < (max || 80)) out.push(x); });
  return out;
}
/** gộp hồ sơ từ máy học sinh (c) vào hồ sơ trên máy chủ (s). bc/be = số xu / tổng xu đã kiếm lúc đồng bộ gần nhất */
function profileMerge_(s, c, bc, be) {
  const num = function (v, d) { v = +v; return isFinite(v) ? v : d; };
  const out = {};
  const hasS = s && Object.keys(s).length > 0;
  let dc = hasS ? num(c.coins, 0) - num(bc, 0) : num(c.coins, 0);
  let de = hasS ? num(c.earned, 0) - num(be, 0) : num(c.earned, 0);
  if (dc > MAX_COIN_DELTA) { de = Math.min(de, MAX_COIN_DELTA); dc = MAX_COIN_DELTA; }
  if (de > MAX_COIN_DELTA) de = MAX_COIN_DELTA;
  out.coins = Math.max(0, Math.min(1000000, Math.round((hasS ? num(s.coins, 0) : 0) + dc)));
  out.earned = Math.max(0, Math.round((hasS ? num(s.earned, 0) : 0) + de));
  out.owned = unionArr_(s && s.owned, c.owned);
  out.ownedPets = unionArr_(s && s.ownedPets, c.ownedPets);
  out.ownedThemes = unionArr_(s && s.ownedThemes, c.ownedThemes);
  out.avatar = String(c.avatar != null ? c.avatar : (s && s.avatar) || '').slice(0, 40);
  out.theme = String(c.theme != null ? c.theme : (s && s.theme) || '').slice(0, 40);
  // thú nuôi: lấy bản mới hơn, điểm kinh nghiệm lấy số lớn hơn
  const sp = (s && s.pet) || {}, cp = c.pet || {};
  const pick = num(cp.last, 0) >= num(sp.last, 0) ? cp : sp;
  out.pet = { kind: String(pick.kind || cp.kind || sp.kind || '').slice(0, 30), name: String(pick.name || '').slice(0, 24), xp: Math.max(num(sp.xp, 0), num(cp.xp, 0)), cute: Math.max(0, Math.min(100, num(pick.cute, 40))), last: Math.max(num(sp.last, 0), num(cp.last, 0)), fed: Math.max(num(sp.fed, 0), num(cp.fed, 0)) };
  // nhiệm vụ ngày
  const sq = (s && s.quest) || {}, cq = c.quest || {};
  if (String(cq.day || '') > String(sq.day || '')) out.quest = cq;
  else if (String(cq.day || '') < String(sq.day || '')) out.quest = sq;
  else {
    const p = {}; [sq.p, cq.p].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { p[k] = Math.max(num(p[k], 0), num((o || {})[k], 0)); }); });
    out.quest = { day: cq.day || sq.day || '', p: p, done: unionArr_(sq.done, cq.done), bonus: !!(sq.bonus || cq.bonus) };
  }
  // chuỗi ngày
  const ss = (s && s.streak) || {}, cs = c.streak || {};
  const pickS = String(cs.last || '') > String(ss.last || '') ? cs : String(cs.last || '') < String(ss.last || '') ? ss : { last: cs.last || ss.last || '', n: Math.max(num(cs.n, 0), num(ss.n, 0)) };
  out.streak = { last: String(pickS.last || ''), n: num(pickS.n, 0), best: Math.max(num(ss.best, 0), num(cs.best, 0), num(pickS.n, 0)) };
  // ngân hàng câu sai (ôn lặp lại): gộp theo khoá, giữ bản cập nhật sau cùng
  const wb = {};
  [s && s.wb, c.wb].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { const it = o[k]; if (!it || typeof it !== 'object') return; if (!wb[k] || num(it.t, 0) >= num(wb[k].t, 0)) wb[k] = it; }); });
  const wk = Object.keys(wb).filter(function (k) { return !(wb[k].m && num(wb[k].t, 0) < Date.now() - 30 * 86400000); });
  wk.sort(function (a, b2) { return num(wb[b2].t, 0) - num(wb[a].t, 0); });
  out.wb = {}; wk.slice(0, 300).forEach(function (k) { out.wb[k] = wb[k]; });
  // thống kê & bản đồ: lấy số lớn hơn
  const st = {}; [(s && s.st) || {}, c.st || {}].forEach(function (o) { Object.keys(o).forEach(function (k) { st[k] = Math.max(num(st[k], 0), num(o[k], 0)); }); }); out.st = st;
  const mp = {}; [(s && s.map) || {}, c.map || {}].forEach(function (o) { Object.keys(o).forEach(function (k) { if (Object.keys(mp).length < 300 || mp[k] != null) mp[k] = Math.max(num(mp[k], 0), num(o[k], 0)); }); }); out.map = mp;
  out.spk = spkMerge_(s && s.spk, c.spk);   // Speaking Starters: sao + sticker
  out.fly = spkMerge_(s && s.fly, c.fly);   // Speaking Flyers: sao + sticker (cùng cách gộp)
  out.mov = spkMerge_(s && s.mov, c.mov);   // Speaking Movers: sao + sticker (cùng cách gộp)
  return out;
}
/** gộp tiến trình Speaking Starters (sao theo bộ đề + sticker): sao lấy số lớn hơn, sticker lấy hợp */
function spkMerge_(a, b) {
  const stars = {}, stk = [];
  [a, b].forEach(function (o) {
    const m = (o && o.stars && typeof o.stars === 'object') ? o.stars : {};
    Object.keys(m).slice(0, 200).forEach(function (k) {
      const v = m[k] || {}, key = String(k).slice(0, 40), cur = stars[key] || { n: 0, t: 0 };
      stars[key] = { n: Math.max(cur.n, Number(v.n) || 0), t: Math.max(cur.t, Number(v.t) || 0) };
    });
    (o && Array.isArray(o.stk) ? o.stk : []).forEach(function (x) { const n = Number(x); if (isFinite(n) && n >= 0 && n < 100 && stk.indexOf(n) < 0) stk.push(n); });
  });
  stk.sort(function (x, y) { return x - y; });
  return { stars: stars, stk: stk };
}
function profileSave_(name, b) {
  if (!name) throw new Error('Thiếu tên học viên');
  const c = b.profile;
  if (!c || typeof c !== 'object') throw new Error('Hồ sơ không hợp lệ');
  const f = profileRow_(name);
  const merged = profileMerge_(f ? f.data : null, c, b.bc, b.be);
  const text = JSON.stringify(merged);
  if (text.length > PROFILE_MAX_BYTES) throw new Error('Hồ sơ quá lớn');
  const vals = [safe_(name), text, new Date().toISOString()];
  if (f) f.sh.getRange(f.row, 1, 1, 3).setValues([vals]); else sheet_('profiles').appendRow(vals);
  return { ok: true, profile: merged };
}
function profileList_() {
  return { ok: true, list: rows_('profiles').map(function (r) {
    const d = parseObj_(r.data), pet = d.pet || {}, st = d.streak || {};
    const spk = d.spk || {}; return { name: String(r.name), spkStars: Object.keys(spk.stars || {}).length, spkStickers: (spk.stk || []).length, flyStars: Object.keys((d.fly || {}).stars || {}).length, flyStickers: ((d.fly || {}).stk || []).length, movStars: Object.keys((d.mov || {}).stars || {}).length, movStickers: ((d.mov || {}).stk || []).length, coins: d.coins || 0, earned: d.earned || 0, pet: pet.kind || '', petXp: pet.xp || 0, streak: st.n || 0, lastDay: st.last || '', updated: r.updated };
  }) };
}

/* ---------- giao app cho học viên ---------- */
function appAccess_(name, teacher) {
  if (teacher) return { ok: true, hidden: [] };
  const hidden = [];
  rows_('appAssign').forEach(function (r) {
    const names = parseArr_(r.names);
    if (names.length && !names.some(function (n) { return sameName_(n, name); })) hidden.push(String(r.appId));
  });
  return { ok: true, hidden: hidden };
}
function appAssignSave_(appId, names) {
  appId = cut_(appId, 80);
  if (!appId) throw new Error('Thiếu mã app');
  names = (Array.isArray(names) ? names : []).map(function (n) { return cut_(n, 60); }).filter(Boolean).slice(0, 300);
  const sh = sheet_('appAssign'), n = sh.getLastRow();
  let rowIdx = -1;
  if (n >= 2) { const ids = sh.getRange(2, 1, n - 1, 1).getValues(); for (let i = 0; i < ids.length; i++) if (ids[i][0] === appId) { rowIdx = i + 2; break; } }
  if (!names.length) { if (rowIdx > 0) sh.deleteRow(rowIdx); return { ok: true }; }
  const vals = [safe_(appId), JSON.stringify(names), new Date().toISOString()];
  if (rowIdx > 0) sh.getRange(rowIdx, 1, 1, 3).setValues([vals]); else sh.appendRow(vals);
  return { ok: true };
}
/** bài tập được giao cho ai: rỗng = tất cả */
function allowed_(assigned, name, teacher) {
  if (teacher) return true;
  if (!Array.isArray(assigned) || !assigned.length) return true;
  return assigned.some(function (n) { return sameName_(n, name); });
}

/* ---------- bảng tính ---------- */
let SS_ = null;
const SHEET_MEMO_ = {};
function sheet_(key) {
  if (SHEET_MEMO_[key]) return SHEET_MEMO_[key];
  const ss = SS_ || (SS_ = SpreadsheetApp.getActiveSpreadsheet());
  let sh = ss.getSheetByName(key);
  if (!sh) {
    // hai lượt chạy cùng tạo trang tính một lúc (khi không còn khoá chung cho thao tác đọc): lượt thua lấy trang đã có
    try { sh = ss.insertSheet(key); } catch (e) { sh = ss.getSheetByName(key); if (!sh) throw e; }
    sh.getRange(1, 1, 1, SHEETS[key].length).setValues([SHEETS[key]]).setFontWeight('bold');
    sh.setFrozenRows(1);
    if (key === 'students') sh.getRange('B:B').setNumberFormat('@'); // giữ mã dạng chữ (không bị đổi thành số)
    if (key === 'answers') sh.getRange(1, SHEETS.answers.indexOf('no') + 1, sh.getMaxRows(), 1).setNumberFormat('@'); // số câu "1.10" không bị đổi thành số 1.1
  } else if (sh.getLastColumn() < SHEETS[key].length) {
    // trang tính cũ thiếu cột mới (vd. answers chưa có sec/no/ans/key): thêm tiêu đề, dữ liệu cũ giữ nguyên
    sh.getRange(1, 1, 1, SHEETS[key].length).setValues([SHEETS[key]]).setFontWeight('bold');
    if (key === 'answers') sh.getRange(1, SHEETS.answers.indexOf('no') + 1, sh.getMaxRows(), 1).setNumberFormat('@');
  }
  SHEET_MEMO_[key] = sh;
  return sh;
}
function rowObj_(cols, r) {
  const o = {};
  cols.forEach(function (c, i) { o[c] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
  return o;
}
/** chỉ đọc `max` dòng CUỐI của trang tính (thay vì đọc cả bảng rồi mới cắt) */
function rowsTail_(key, max) {
  const sh = sheet_(key), n = sh.getLastRow();
  if (n < 2) return [];
  const cols = SHEETS[key], start = Math.max(2, n - max + 1);
  return sh.getRange(start, 1, n - start + 1, cols.length).getValues().map(function (r) { return rowObj_(cols, r); });
}
/** số dòng (trong sheet) đầu tiên có cột `col` = val (so sánh chuỗi); 0 nếu không có. Chỉ đọc đúng 1 cột. */
function findRow_(key, col, val) {
  const sh = sheet_(key), n = sh.getLastRow();
  if (n < 2) return 0;
  const vals = sh.getRange(2, SHEETS[key].indexOf(col) + 1, n - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) if (String(vals[i][0]) === String(val)) return i + 2;
  return 0;
}
/** câu trả lời chi tiết của MỘT bài nộp (hwDetail): dò 4 cột nhỏ trước, chỉ đọc đầy đủ đoạn dòng có liên quan */
function hwAnswers_(hwId, student, attempt) {
  const sh = sheet_('answers'), n = sh.getLastRow(), cols = SHEETS.answers;
  if (n < 2) return [];
  const c0 = cols.indexOf('name');   // name, source, sourceId, attempt nằm liền nhau
  const head = sh.getRange(2, c0 + 1, n - 1, 4).getValues();
  const ok = function (r) { return r[1] === 'hw' && r[2] === hwId && sameName_(r[0], student) && String(r[3]) === String(attempt); };
  let first = -1, last = -1;
  for (let i = 0; i < head.length; i++) if (ok(head[i])) { if (first < 0) first = i; last = i; }
  if (first < 0) return [];
  return sh.getRange(first + 2, 1, last - first + 1, cols.length).getValues().map(function (r) { return rowObj_(cols, r); })
    .filter(function (r) { return r.source === 'hw' && r.sourceId === hwId && sameName_(r.name, student) && String(r.attempt) === String(attempt); });
}
/** số lần một học viên đã nộp một bài tập (chỉ đọc 2 cột name, hwId) */
function subsCount_(hwId, name) {
  const sh = sheet_('submissions'), n = sh.getLastRow();
  if (n < 2) return 0;
  const c0 = SHEETS.submissions.indexOf('name');   // name, hwId liền nhau
  const v = sh.getRange(2, c0 + 1, n - 1, 2).getValues();
  let k = 0;
  for (let i = 0; i < v.length; i++) if (v[i][1] === hwId && v[i][0] === name) k++;
  return k;
}
function rows_(key) {
  const sh = sheet_(key), n = sh.getLastRow();
  if (n < 2) return [];
  const cols = SHEETS[key], vals = sh.getRange(2, 1, n - 1, cols.length).getValues();
  return vals.map(function (r) { return rowObj_(cols, r); });
}
function append_(key, obj) {
  sheet_(key).appendRow(SHEETS[key].map(function (c) { return obj[c] === undefined ? '' : obj[c]; }));
}
function appendMany_(key, objs) {
  if (!objs.length) return;
  const sh = sheet_(key), cols = SHEETS[key];
  const vals = objs.map(function (o) { return cols.map(function (c) { return o[c] === undefined ? '' : o[c]; }); });
  sh.getRange(sh.getLastRow() + 1, 1, vals.length, cols.length).setValues(vals);
}
function cut_(s, n) { return String(s == null ? '' : s).slice(0, n); }
/** chống công thức: ô bắt đầu bằng = + - @ sẽ bị Sheets hiểu là công thức */
function safe_(s) { s = String(s == null ? '' : s); return /^[=+\-@]/.test(s) ? "'" + s : s; }

/* ---------- lịch sử chơi app ---------- */
function logPlay_(name, p, answers) {
  p = p || {};
  const now = new Date().toISOString();
  const sh = sheet_('plays'), n = sh.getLastRow(), cols = SHEETS.plays;
  const iSid = cols.indexOf('sid'), iName = cols.indexOf('name'), iApp = cols.indexOf('appId'), iAtt = cols.indexOf('attempt');
  let cache = null; try { cache = CacheService.getScriptCache(); } catch (e) { }
  const ckey = p.sid ? 'play:' + String(p.sid).slice(0, 100) : '';
  let rowIdx = -1, attempt = 0;
  // Đường nhanh: lượt chơi này đã ghi trước đó -> nhớ số dòng, chỉ đọc đúng 1 dòng để kiểm tra (không quét cả bảng)
  if (ckey && cache && n >= 2) {
    try {
      const c = cache.get(ckey);
      if (c) {
        const row = +JSON.parse(c).row;
        if (row >= 2 && row <= n) {
          const v = sh.getRange(row, 1, 1, iAtt + 1).getValues()[0];
          if (v[iSid] === p.sid && v[iName] === name && v[iApp] === p.appId) { rowIdx = row; attempt = +v[iAtt]; }
        }
      }
    } catch (e) { rowIdx = -1; }
  }
  // Lần đầu (hoặc bộ nhớ đệm hết hạn): dò bảng nhưng chỉ đọc 3 cột cần thiết thay vì cả 13 cột
  if (rowIdx < 0 && n >= 2) {
    const m = n - 1;
    const sids = sh.getRange(2, iSid + 1, m, 1).getValues();
    const na = sh.getRange(2, iName + 1, m, iApp - iName + 1).getValues();   // name, appId liền nhau
    const att = sh.getRange(2, iAtt + 1, m, 1).getValues();
    for (let i = 0; i < m; i++) {
      if (na[i][0] === name && na[i][iApp - iName] === p.appId) {
        attempt = Math.max(attempt, +att[i][0] || 0);
        if (p.sid && sids[i][0] === p.sid) { rowIdx = i + 2; attempt = +att[i][0]; break; }
      }
    }
  }
  const score = +p.score || 0, max = +p.max || 0, pct = max ? Math.round(100 * score / max) : '';
  if (rowIdx > 0) {
    sh.getRange(rowIdx, cols.indexOf('updated') + 1).setValue(now);
    sh.getRange(rowIdx, cols.indexOf('score') + 1, 1, 4).setValues([[score, max, pct, +p.durationSec || 0]]);
  } else {
    attempt = attempt + 1;
    append_('plays', { sid: cut_(p.sid, 40), time: now, updated: now, name: name, appId: cut_(p.appId, 80), appTitle: safe_(cut_(p.appTitle, 120)), cur: cut_(p.cur, 60), unit: cut_(p.unit, 80), attempt: attempt, score: score, max: max, pct: pct, durationSec: +p.durationSec || 0 });
    rowIdx = sh.getLastRow();
  }
  if (ckey && cache && rowIdx > 0) { try { cache.put(ckey, JSON.stringify({ row: rowIdx }), 21600); } catch (e) { } }
  appendMany_('answers', (answers || []).slice(0, 600).map(function (a) {
    return { time: now, name: name, source: 'app', sourceId: cut_(p.appId, 80), attempt: attempt, topic: safe_(cut_(a.topic, 120)), qid: cut_(a.qid, 80), ok: !!a.ok, q: safe_(cut_(a.q, 160)),
      ans: a.ok ? '' : safe_(cut_(a.ans, 100)), key: a.ok ? '' : safe_(cut_(a.key, 100)) };   // em trả lời gì + đáp án đúng (chỉ khi sai)
  }));
  return { ok: true, attempt: attempt };
}

/* ---------- bài tập ---------- */
function folder_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('HW_FOLDER');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { } }
  const f = DriveApp.createFolder('LittleSprout_BaiTap');
  props.setProperty('HW_FOLDER', f.getId());
  return f;
}
function findHwRow_(id) {
  const sh = sheet_('homework'), n = sh.getLastRow();
  if (n < 2) return null;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (ids[i][0] === id) return { sh: sh, row: i + 2 };
  return null;
}
function hwSave_(hw) {
  if (!hw || !hw.id) throw new Error('Thiếu mã bài tập');
  const now = new Date().toISOString();
  const content = JSON.stringify(hw);
  const found = findHwRow_(hw.id), cols = SHEETS.homework;
  let fileId;
  if (found) {
    fileId = found.sh.getRange(found.row, cols.indexOf('fileId') + 1).getValue();
    try { DriveApp.getFileById(fileId).setContent(content); } catch (e) { fileId = folder_().createFile('hw_' + hw.id + '.json', content, MimeType.PLAIN_TEXT).getId(); }
    const created = found.sh.getRange(found.row, cols.indexOf('created') + 1).getValue();
    found.sh.getRange(found.row, 1, 1, cols.length).setValues([[hw.id, safe_(cut_(hw.title, 150)), cut_(hw.curId, 60), cut_(hw.unitId, 80), !!hw.open, created, now, JSON.stringify(hw.meta || {}), fileId]]);
  } else {
    fileId = folder_().createFile('hw_' + hw.id + '.json', content, MimeType.PLAIN_TEXT).getId();
    append_('homework', { id: hw.id, title: safe_(cut_(hw.title, 150)), curId: cut_(hw.curId, 60), unitId: cut_(hw.unitId, 80), open: !!hw.open, created: now, updated: now, meta: JSON.stringify(hw.meta || {}), fileId: fileId });
  }
  return { ok: true, id: hw.id };
}
function hwList_(name, teacher) {
  const subs = rows_('submissions').filter(function (r) { return r.name === name; });
  const list = rows_('homework').filter(function (r) { return teacher || r.open === true; }).map(function (r) {
    let meta = {}; try { meta = JSON.parse(r.meta || '{}'); } catch (e) { }
    if (!allowed_(meta.assignedTo, name, teacher)) return null;
    if (!teacher) delete meta.assignedTo; // không để em này thấy tên các bạn khác
    const mine = subs.filter(function (s) { return s.hwId === r.id; });
    const best = mine.length ? Math.max.apply(null, mine.map(function (s) { return +s.scaled || 0; })) : null;
    return Object.assign({}, meta, { id: r.id, title: r.title, curId: r.curId, unitId: r.unitId, open: r.open === true, created: r.created, myAttempts: mine.length, myBest: best });
  }).filter(Boolean);
  list.sort(function (a, c) { return String(c.created).localeCompare(String(a.created)); });
  return { ok: true, list: list };
}
function hwGet_(id, teacher, name) {
  const f = findHwRow_(id);
  if (!f) throw new Error('Không tìm thấy bài tập');
  const cols = SHEETS.homework, r = f.sh.getRange(f.row, 1, 1, cols.length).getValues()[0];
  if (!teacher && r[cols.indexOf('open')] !== true) throw new Error('Bài tập đang đóng');
  const hw = JSON.parse(DriveApp.getFileById(r[cols.indexOf('fileId')]).getBlob().getDataAsString());
  hw.open = r[cols.indexOf('open')] === true;
  hw.meta = hw.meta || {};
  if (!allowed_(hw.meta.assignedTo, name, teacher)) throw new Error('Bài tập này không được giao cho em');
  if (!teacher) delete hw.meta.assignedTo;
  return { ok: true, hw: hw };
}
function hwSetOpen_(id, open) {
  const f = findHwRow_(id);
  if (!f) throw new Error('Không tìm thấy bài tập');
  const cols = SHEETS.homework;
  f.sh.getRange(f.row, cols.indexOf('open') + 1).setValue(open);
  // đồng bộ cờ open trong file JSON
  try {
    const fid = f.sh.getRange(f.row, cols.indexOf('fileId') + 1).getValue(), file = DriveApp.getFileById(fid);
    const hw = JSON.parse(file.getBlob().getDataAsString()); hw.open = open; file.setContent(JSON.stringify(hw));
  } catch (e) { }
  return { ok: true };
}
function hwDelete_(id) {
  const f = findHwRow_(id);
  if (!f) return { ok: true };
  const cols = SHEETS.homework, fid = f.sh.getRange(f.row, cols.indexOf('fileId') + 1).getValue();
  try { DriveApp.getFileById(fid).setTrashed(true); } catch (e) { }
  f.sh.deleteRow(f.row);
  return { ok: true };
}
function hwSubmit_(name, b, teacher) {
  const f = findHwRow_(b.id);
  if (!f) throw new Error('Không tìm thấy bài tập');
  const cols = SHEETS.homework, r = f.sh.getRange(f.row, 1, 1, cols.length).getValues()[0];
  if (r[cols.indexOf('open')] !== true && !teacher) throw new Error('Bài tập đang đóng');
  let meta = {}; try { meta = JSON.parse(r[cols.indexOf('meta')] || '{}'); } catch (e) { }
  if (!allowed_(meta.assignedTo, name, teacher)) throw new Error('Bài tập này không được giao cho em');
  const nowMs = Date.now();
  if (!teacher) {
    if (meta.start && nowMs < new Date(meta.start).getTime()) throw new Error('Bài tập chưa mở');
    if (meta.end && nowMs > new Date(meta.end).getTime()) throw new Error('Bài tập đã hết hạn nộp');
  }
  const mineCount = subsCount_(b.id, name);
  if (meta.maxAttempts && mineCount >= meta.maxAttempts && !teacher) throw new Error('Em đã hết lượt làm bài này');
  const attempt = mineCount + 1, score = +b.score || 0, max = +b.max || 0;
  const scaled = max ? Math.round(score / max * (meta.scale || 10) * 100) / 100 : 0;
  const now = new Date().toISOString();
  append_('submissions', { time: now, name: name, hwId: b.id, hwTitle: r[cols.indexOf('title')], attempt: attempt, score: score, max: max, scaled: scaled, durationSec: +b.durationSec || 0 });
  appendMany_('answers', (b.items || []).slice(0, 800).map(function (a) {
    return { time: now, name: name, source: 'hw', sourceId: b.id, attempt: attempt, topic: safe_(cut_(a.topic, 120)), qid: cut_(a.qid, 80), ok: !!a.ok, q: safe_(cut_(a.q, 240)),
      sec: safe_(cut_(a.sec, 120)), no: safe_(cut_(a.no, 12)), ans: safe_(cut_(a.ans, 200)), key: safe_(cut_(a.key, 200)) };
  }));
  return { ok: true, attempt: attempt, scaled: scaled };
}

/* ============================================================
   CHẤM SPEAKING BẰNG AI (Gemini) — chỉ dành cho cô giáo
   Khoá Gemini KHÔNG nằm trong code: cài ở Apps Script -> Cài đặt dự án -> Thuộc tính tập lệnh:
     GEMINI_API_KEY  = khoá lấy ở https://aistudio.google.com/apikey   (bắt buộc)
     GEMINI_MODEL    = tên model (không bắt buộc, mặc định gemini-3.8-flash)
   ============================================================ */
const SPG_DEFAULT_MODEL = 'gemini-3.8-flash';
const SPG_MAX_AUDIO_B64 = 15 * 1024 * 1024;   // ~11 MB âm thanh (Gemini nhận tối đa 20 MB cả yêu cầu)
const SPG_MAX_CELL = 46000;                    // một ô Google Sheets chứa tối đa 50.000 ký tự

function spgProps_() { return PropertiesService.getScriptProperties(); }

/** Gọi Gemini chấm một file ghi âm. KHÔNG chạy trong khoá chung (xem doPost) vì mất 20-60 giây. */
function spgGrade_(b) {
  const a = auth_(b);
  if (!a || a.role !== 'teacher') throw new Error('Chỉ dành cho cô giáo');
  const key = spgProps_().getProperty('GEMINI_API_KEY');
  if (!key) throw new Error('Chưa cài khoá Gemini. Vào Apps Script -> Cài đặt dự án -> Thuộc tính tập lệnh -> thêm GEMINI_API_KEY (xem HUONG-DAN.md, mục Chấm Speaking).');
  const model = String(spgProps_().getProperty('GEMINI_MODEL') || SPG_DEFAULT_MODEL).trim();
  if (!/^[a-zA-Z0-9._-]{3,60}$/.test(model)) throw new Error('GEMINI_MODEL không hợp lệ: ' + model);
  const audio = String(b.audioBase64 || '');
  if (audio.length < 2000) throw new Error('Không nhận được dữ liệu âm thanh.');
  if (audio.length > SPG_MAX_AUDIO_B64) throw new Error('File ghi âm quá dài/nặng (tối đa khoảng 5 phút). Hãy cắt ngắn rồi chấm lại.');
  const mime = /^audio\/(wav|mp3|aac|ogg|flac|aiff)$/.test(String(b.mimeType || '')) ? b.mimeType : 'audio/wav';
  const items = (Array.isArray(b.rubric) ? b.rubric : []).filter(function (it) {
    return it && /^[A-Za-z]{2,24}$/.test(String(it.id)) && +it.max > 0 && +it.max <= 30;
  }).map(function (it) { return { id: String(it.id), label: cut_(it.label, 80), max: +it.max, def: cut_(it.def, 400) }; });
  if (!items.length) throw new Error('Thiếu rubric.');

  const prompt = spgPrompt_(b, items);
  // Gemini 3.x: không đặt temperature (Google khuyên bỏ), dùng thinkingLevel; 2.5: dùng thinkingBudget.
  const is3 = /gemini-3/.test(model);
  const gen = { responseMimeType: 'application/json', maxOutputTokens: is3 ? 16384 : 8192 };
  if (!is3) gen.temperature = 0.2;
  if (is3) gen.thinkingConfig = { thinkingLevel: 'medium' };
  else if (/2\.5-flash/.test(model) && !/lite/.test(model)) gen.thinkingConfig = { thinkingBudget: 2048 };
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent';
  const payload = function (withSchema, withThink) {
    const g = JSON.parse(JSON.stringify(gen));
    if (withThink === false) delete g.thinkingConfig;
    if (withSchema) g.responseSchema = spgSchema_(items);
    return JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: audio } }] }], generationConfig: g });
  };
  let res = spgFetch_(url, key, payload(true));
  if (res.code === 400 && /thinking/i.test(res.text)) res = spgFetch_(url, key, payload(true, false));   // model không nhận cấu hình suy luận
  if (res.code === 400 && /schema|response_schema|responseSchema/i.test(res.text)) res = spgFetch_(url, key, payload(false, false));   // model không nhận schema: vẫn có mô tả JSON trong lời nhắc
  if (res.code !== 200) throw new Error(spgHttpError_(res, model));

  let data;
  try { data = JSON.parse(res.text); } catch (e) { throw new Error('Gemini trả về dữ liệu lạ, hãy thử lại.'); }
  if (data.promptFeedback && data.promptFeedback.blockReason) throw new Error('Gemini từ chối xử lý file này (' + data.promptFeedback.blockReason + ').');
  const cand = data.candidates && data.candidates[0];
  const parts = cand && cand.content && cand.content.parts || [];
  const text = parts.map(function (p) { return p.text || ''; }).join('').trim();
  if (!text) throw new Error('Gemini không trả về nội dung' + (cand && cand.finishReason ? ' (' + cand.finishReason + ')' : '') + '. Thử lại hoặc dùng file rõ tiếng hơn.');
  const parsed = spgParseJson_(text);
  if (!parsed) throw new Error('Không đọc được kết quả của Gemini' + (cand && cand.finishReason === 'MAX_TOKENS' ? ' (bị cắt giữa chừng, thử lại)' : '') + '. Hãy bấm chấm lại.');
  return { ok: true, raw: parsed, model: model, usage: data.usageMetadata || null };
}

/* ============================================================
   AI SOẠN BÀI TẬP TỪ ẢNH SÁCH (Gemini) — chỉ dành cho cô giáo
   Dùng chung GEMINI_API_KEY / GEMINI_MODEL với Chấm Speaking. Lời nhắc do trang web dựng sẵn (theo đúng cú pháp từng dạng bài).
   ============================================================ */
const HWAI_MAX_IMAGES = 8;
const HWAI_MAX_B64 = 15 * 1024 * 1024;   // tổng dữ liệu ảnh (Gemini nhận tối đa 20 MB cả yêu cầu)

function hwAi_(b) {
  const a = auth_(b);
  if (!a || a.role !== 'teacher') throw new Error('Chỉ dành cho cô giáo');
  const key = spgProps_().getProperty('GEMINI_API_KEY');
  if (!key) throw new Error('Chưa cài khoá Gemini. Vào Apps Script -> Cài đặt dự án -> Thuộc tính tập lệnh -> thêm GEMINI_API_KEY (xem HUONG-DAN.md).');
  const model = String(spgProps_().getProperty('GEMINI_MODEL') || SPG_DEFAULT_MODEL).trim();
  if (!/^[a-zA-Z0-9._-]{3,60}$/.test(model)) throw new Error('GEMINI_MODEL không hợp lệ: ' + model);
  const prompt = String(b.prompt || '');
  if (prompt.length < 200 || prompt.length > 40000) throw new Error('Lời nhắc không hợp lệ.');
  const imgs = (Array.isArray(b.images) ? b.images : []).slice(0, HWAI_MAX_IMAGES).filter(function (im) {
    return im && /^image\/(jpeg|png|webp)$/.test(String(im.mimeType || '')) && String(im.data || '').length > 500;
  });
  if (!imgs.length) throw new Error('Chưa nhận được ảnh nào.');
  let total = 0; imgs.forEach(function (im) { total += String(im.data).length; });
  if (total > HWAI_MAX_B64) throw new Error('Ảnh quá nặng. Chọn ít ảnh hơn (tối đa khoảng 8 ảnh) rồi thử lại.');

  const is3 = /gemini-3/.test(model);
  const gen = { responseMimeType: 'application/json', maxOutputTokens: is3 ? 32768 : 16384 };
  if (!is3) gen.temperature = 0.3;
  if (is3) gen.thinkingConfig = { thinkingLevel: 'medium' };
  else if (/2\.5-flash/.test(model) && !/lite/.test(model)) gen.thinkingConfig = { thinkingBudget: 2048 };
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent';
  const parts = [{ text: prompt }];
  imgs.forEach(function (im) { parts.push({ inlineData: { mimeType: im.mimeType, data: String(im.data) } }); });
  const payload = function (withThink) {
    const g = JSON.parse(JSON.stringify(gen));
    if (withThink === false) delete g.thinkingConfig;
    return JSON.stringify({ contents: [{ role: 'user', parts: parts }], generationConfig: g });
  };
  let res = spgFetch_(url, key, payload(true));
  if (res.code === 400 && /thinking/i.test(res.text)) res = spgFetch_(url, key, payload(false));
  if (res.code !== 200) throw new Error(spgHttpError_(res, model));

  let data;
  try { data = JSON.parse(res.text); } catch (e) { throw new Error('Gemini trả về dữ liệu lạ, hãy thử lại.'); }
  if (data.promptFeedback && data.promptFeedback.blockReason) throw new Error('Gemini từ chối xử lý ảnh này (' + data.promptFeedback.blockReason + ').');
  const cand = data.candidates && data.candidates[0];
  const rp = cand && cand.content && cand.content.parts || [];
  const text = rp.map(function (p) { return p.text || ''; }).join('').trim();
  if (!text) throw new Error('Gemini không trả về nội dung' + (cand && cand.finishReason ? ' (' + cand.finishReason + ')' : '') + '. Thử lại hoặc dùng ảnh rõ hơn.');
  const parsed = spgParseJson_(text);
  if (!parsed) throw new Error('Không đọc được kết quả của Gemini' + (cand && cand.finishReason === 'MAX_TOKENS' ? ' (bị cắt giữa chừng: chọn ít dạng bài hoặc ít câu hơn)' : '') + '. Hãy bấm soạn lại.');
  return { ok: true, raw: parsed, model: model };
}

function spgFetch_(url, key, body) {
  let r;
  for (let i = 0; i < 2; i++) {
    r = UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', headers: { 'x-goog-api-key': key }, payload: body, muteHttpExceptions: true });
    const c = r.getResponseCode();
    if (c !== 503 && c !== 500 && c !== 502) break;
    Utilities.sleep(2500);
  }
  return { code: r.getResponseCode(), text: r.getContentText() };
}

function spgHttpError_(res, model) {
  let msg = '';
  try { msg = JSON.parse(res.text).error.message || ''; } catch (e) { msg = String(res.text || '').slice(0, 200); }
  if (res.code === 400 && /API key/i.test(msg)) return 'Khoá Gemini không hợp lệ. Kiểm tra lại GEMINI_API_KEY.';
  if (res.code === 400) return 'Gemini báo lỗi dữ liệu gửi lên: ' + cut_(msg, 200);
  if (res.code === 401 || res.code === 403) return 'Gemini từ chối khoá này (chưa bật quyền hoặc bị chặn): ' + cut_(msg, 160);
  if (res.code === 404) return 'Model "' + model + '" không còn dùng được: ' + cut_(msg, 160) + ' Đổi GEMINI_MODEL trong Thuộc tính tập lệnh sang model mới hơn.';
  if (res.code === 429) return 'Gemini báo hết lượt hoặc gọi quá nhanh. Đợi 1-2 phút rồi chấm lại (gói miễn phí giới hạn số lần mỗi phút/ngày).';
  if (res.code >= 500) return 'Máy chủ Gemini đang bận (' + res.code + '). Thử lại sau ít phút.';
  return 'Gemini lỗi ' + res.code + ': ' + cut_(msg, 200);
}

function spgParseJson_(t) {
  t = String(t || '').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try { return JSON.parse(t); } catch (e) { }
  const i = t.indexOf('{'), j = t.lastIndexOf('}');
  if (i >= 0 && j > i) { try { return JSON.parse(t.slice(i, j + 1)); } catch (e) { } }
  return null;
}

function spgSchema_(items) {
  const S = { type: 'STRING' }, N = { type: 'NUMBER' };
  const arrS = { type: 'ARRAY', items: S };
  const obj = function (props, req) { return { type: 'OBJECT', properties: props, required: req || Object.keys(props) }; };
  const scoreProps = {};
  items.forEach(function (it) { scoreProps[it.id] = obj({ score: N, comment: S }); });
  return obj({
    transcript: S, audioNote: S, confidence: S, estimatedSeconds: N,
    scores: obj(scoreProps),
    pronunciationIssues: { type: 'ARRAY', items: obj({ word: S, time: S, heard: S, expected: S, tip: S, confidence: S }, ['word', 'tip']) },
    vocabUsed: arrS, vocabMissing: arrS, phrasesUsed: arrS, phrasesMissing: arrS, connectorsUsed: arrS,
    grammarErrors: { type: 'ARRAY', items: obj({ said: S, better: S, rule: S }) },
    strengths: arrS, weaknesses: arrS,
    improvements: { type: 'ARRAY', items: obj({ title: S, how: S, practice: S }) },
    naturalPhrasing: { type: 'ARRAY', items: obj({ said: S, moreNatural: S, why: S }) },
    nextChallenge: obj({ scenario: S, sentences: arrS })
  }, ['transcript', 'scores', 'strengths', 'weaknesses', 'improvements']);
}

function spgList_(v) { return (Array.isArray(v) ? v : String(v || '').split(/\n|;/)).map(function (x) { return cut_(x, 160).trim(); }).filter(Boolean).slice(0, 60); }

function spgPrompt_(b, items) {
  const L = b.lesson || {}, S = b.settings || {}, M = b.measured || {};
  const lines = [];
  lines.push('You are an experienced English speaking examiner and pronunciation coach for ADULT Vietnamese learners of English who study workplace and everyday communication with a teacher named Miss Thao. You are listening to ONE learner recording (a short monologue, homework). Grade it against the rubric below and return ONLY JSON.');
  lines.push('');
  lines.push('LANGUAGE: Write every comment, tip, strength, weakness and explanation in VIETNAMESE (simple, warm, specific, addressed to the teacher who will pass it on). Keep English examples, quoted learner words, corrected sentences and IPA in English.');
  lines.push('');
  lines.push('HONESTY RULES (very important):');
  lines.push('- Listen to the audio. Transcribe VERBATIM exactly what the learner said, including grammar mistakes, repeated words and fillers (uh, um, er). Do NOT correct, polish or complete the sentences. Mark inaudible parts as [unclear].');
  lines.push('- Only report a pronunciation problem you can actually hear. For each one give the word, the approximate time mm:ss, what you heard, what is expected, one practical mouth/tongue/lip tip, and your confidence (high/medium/low). If unsure, use low. NEVER invent errors to fill the list; an empty list is fine.');
  lines.push('- If the audio is very short, noisy, or you cannot judge a criterion reliably, say so in audioNote, set confidence to "low", and score that criterion conservatively around the middle.');
  lines.push('- Judge communication, not accent. A Vietnamese accent is not an error; judge whether sounds are clear and the target sounds of the lesson are produced.');
  lines.push('- Be fair and encouraging but accurate. Use the full range of each score. Scores must be numbers in steps of 0.5, never above the maximum.');
  lines.push('');
  lines.push('LESSON CONTEXT (set by the teacher; use it as the standard):');
  lines.push('- Lesson: ' + cut_((L.code ? L.code + ' - ' : '') + (L.title || ''), 120));
  if (L.prompt) lines.push('- Speaking task given to the learner: ' + cut_(L.prompt, 400));
  lines.push('- Target sounds / IPA focus: ' + (cut_(L.targetSounds, 200) || '(not specified)') + (L.soundNotes ? ' | notes: ' + cut_(L.soundNotes, 400) : ''));
  lines.push('- Core lesson vocabulary: ' + (spgList_(L.vocab).join(', ') || '(not specified: judge topical vocabulary in general and say so)'));
  lines.push('- Lesson phrases / collocations: ' + (spgList_(L.phrases).join(', ') || '(none)'));
  lines.push('- Target grammar: ' + (cut_(L.grammar, 400) || '(not specified)'));
  if (L.notes) lines.push('- Other teacher notes: ' + cut_(L.notes, 400));
  lines.push('- Taught interview phrases (all lessons): ' + (spgList_(S.phrases).join(', ') || '(none)'));
  lines.push('- Expected connectors: ' + (spgList_(S.connectors).join(', ') || 'because, for example, so, and then'));
  lines.push('- Word-stress examples taught: ' + (spgList_(S.stressWords).join(', ') || '(none)') + '; ending sounds to keep: ' + (spgList_(S.endSounds).join(' ') || '/t/ /d/ /s/ /p/'));
  lines.push('');
  if (M && M.ok) {
    lines.push('OBJECTIVE MEASUREMENTS from the audio file (computed by software, reliable): speaking span ' + M.spanSec + ' s, actual speech ' + M.speechSec + ' s, pauses of 0.5 s or longer: ' + M.pauseCount + ' (of which 1.2 s or longer: ' + M.longPauseCount + '), longest pause ' + M.longestPause + ' s. Use these for the pace criterion together with what you hear.');
    lines.push('');
  }
  lines.push('RUBRIC TO SCORE (put one entry per id inside "scores", each {score, comment}; the comment cites concrete evidence from the recording in 1-2 sentences):');
  items.forEach(function (it) { lines.push('- ' + it.id + ' (max ' + it.max + '): ' + it.label + '. ' + it.def); });
  lines.push('Score anchors: 90-100% of max = consistently good with only trivial slips; 70-89% = minor recurring issues, fully understandable; 40-69% = noticeable issues that sometimes reduce clarity; below 40% = frequent issues that often block understanding or the skill is almost absent.');
  lines.push('');
  lines.push('OTHER FIELDS:');
  lines.push('- transcript: verbatim transcript. estimatedSeconds: length of the speech in seconds. confidence: high/medium/low for your overall reliability.');
  lines.push('- vocabUsed / vocabMissing: from the core lesson vocabulary only (vocabMissing = lesson words the learner could have used but did not). phrasesUsed / phrasesMissing: from lesson phrases and taught interview phrases. connectorsUsed: connectors actually said.');
  lines.push('- grammarErrors: each {said (exact words), better (corrected), rule (short Vietnamese explanation)}; prioritise errors related to the target grammar, then the most important others (max 8).');
  lines.push('- strengths (2-4) and weaknesses (2-4): specific, Vietnamese, each tied to evidence. improvements (2-4): {title, how (what to change, Vietnamese), practice (a concrete 5-minute drill, Vietnamese)}.');
  lines.push('- naturalPhrasing (0-4): sentences the learner said that are understandable but not how people naturally say it in real life; give {said, moreNatural, why (Vietnamese)}. Focus on real-life communication, not textbook English.');
  lines.push('- nextChallenge: {scenario: a short real-life situation in Vietnamese for the next lesson warm-up, sentences: 2-4 English model sentences using the lesson language}.');
  lines.push('');
  lines.push('Return a single JSON object with exactly these keys: transcript, audioNote, confidence, estimatedSeconds, scores{' + items.map(function (it) { return it.id; }).join(', ') + '}, pronunciationIssues[{word,time,heard,expected,tip,confidence}], vocabUsed[], vocabMissing[], phrasesUsed[], phrasesMissing[], connectorsUsed[], grammarErrors[{said,better,rule}], strengths[], weaknesses[], improvements[{title,how,practice}], naturalPhrasing[{said,moreNatural,why}], nextChallenge{scenario,sentences[]}.');
  return lines.join('\n');
}

/* ---------- lưu cấu hình bài & kết quả chấm ---------- */
function spgShrink_(obj) {
  let s = JSON.stringify(obj);
  if (s.length <= SPG_MAX_CELL) return s;
  const o = JSON.parse(s), r = o.result || o;
  if (r.transcript) r.transcript = String(r.transcript).slice(0, 4000);
  ['pronunciationIssues', 'grammarErrors', 'naturalPhrasing', 'improvements'].forEach(function (k) { if (Array.isArray(r[k])) r[k] = r[k].slice(0, 8); });
  if (o.zalo) o.zalo = String(o.zalo).slice(0, 3000);
  s = JSON.stringify(o);
  if (s.length > SPG_MAX_CELL) throw new Error('Kết quả quá dài để lưu.');
  return s;
}
/** Mã bài chuẩn của một dòng trong sheet spgLessons.
 *  Thứ tự tin cậy: mã trong JSON -> số bài trong tên ("Bài 6.2 · ...") -> ô mã nếu là chữ hợp lệ.
 *  Ô mã bị Sheets đổi thành ngày (6.2 -> 2 tháng 6) thì bỏ qua, vì không biết là ngày/tháng hay tháng/ngày. */
function spgRowId_(cell, d, titleCell) {
  const ok = function (x) { x = String(x == null ? '' : x).trim(); return /^[A-Za-z0-9_.-]+$/.test(x) ? x : ''; };
  d = d || {};
  let id = ok(d.id) || ok(d.code);
  if (!id) { const m = String(d.title || titleCell || '').match(/\d+(?:\.\d+)*/); id = m ? m[0] : ''; }
  if (!id && !(cell instanceof Date)) id = ok(cell);
  return id;
}
/** điểm "đầy đủ" của một cấu hình bài: dòng nào nhiều nội dung hơn thì được giữ khi trùng mã */
function spgLessonScore_(d) {
  let n = 0;
  ['prompt', 'targetSounds', 'soundNotes', 'grammar', 'notes'].forEach(function (k) { if (String(d[k] || '').trim()) n++; });
  n += (Array.isArray(d.vocab) ? d.vocab.length : 0) + (Array.isArray(d.phrases) ? d.phrases.length : 0);
  return n;
}
function spgLessonList_() {
  const best = {}, order = [], settings = { v: 1 };
  let st = null, total = 0;
  rows_('spgLessons').forEach(function (r) {
    let d = {}; try { d = JSON.parse(r.data || '{}') || {}; } catch (e) { d = {}; }
    if (String(r.id) === '_settings') { st = d; return; }
    total++;
    d.title = d.title || String(r.title || '');
    const id = spgRowId_(r.id, d, r.title) || String(d.id || r.id);
    d.id = id; d.code = d.code || id;
    const sc = spgLessonScore_(d), t = String(r.updated || '');
    const cur = best[id];
    if (!cur) { best[id] = { d: d, sc: sc, t: t }; order.push(id); }
    else if (sc > cur.sc || (sc === cur.sc && t > cur.t)) best[id] = { d: d, sc: sc, t: t };
  });
  const out = order.map(function (id) { return best[id].d; });
  /* dupes = số dòng thừa trong Sheet (web dùng để hiện nút "Dọn bài trùng") */
  return { ok: true, lessons: out, settings: st, dupes: total - out.length };
}
function spgLessonSave_(l) {
  l = l || {};
  const id = cut_(l.id, 40).trim();
  if (!id || !/^[A-Za-z0-9_.-]+$/.test(id)) throw new Error('Mã bài chỉ gồm chữ không dấu, số, dấu chấm, gạch (ví dụ 5.1)');
  const clean = {
    id: id, code: cut_(l.code, 20), title: cut_(l.title, 120), prompt: cut_(l.prompt, 600), targetSounds: cut_(l.targetSounds, 200), soundNotes: cut_(l.soundNotes, 600),
    vocab: spgList_(l.vocab), phrases: spgList_(l.phrases), grammar: cut_(l.grammar, 600), notes: cut_(l.notes, 600)
  };
  const sh = sheet_('spgLessons'), cols = SHEETS.spgLessons;
  const row = [id, safe_(clean.title), JSON.stringify(clean), new Date().toISOString()];
  const found = spgFindLessonRows_(id);
  const target = found.length ? found[0] : Math.max(sh.getLastRow(), 1) + 1;
  sh.getRange(target, 1).setNumberFormat('@'); /* ô mã bài là chữ thường, không để Sheets đổi 6.2 thành ngày */
  sh.getRange(target, 1, 1, cols.length).setValues([row]);
  for (let i = found.length - 1; i >= 1; i--) sh.deleteRow(found[i]); /* dọn dòng trùng nếu có */
  return { ok: true, id: id };
}
/** số dòng (trong sheet) của bài có mã = id; dùng đúng cách tính mã như spgLessonList_ nên cũng tìm được các dòng cũ bị Sheets đổi ô mã thành ngày */
function spgFindLessonRows_(id) {
  const sh = sheet_('spgLessons'), n = sh.getLastRow(), out = [];
  if (n < 2) return out;
  const vals = sh.getRange(2, 1, n - 1, SHEETS.spgLessons.length).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]) === '_settings') continue;
    let d = {}; try { d = JSON.parse(vals[i][2] || '{}') || {}; } catch (e) { d = {}; }
    if (spgRowId_(vals[i][0], d, vals[i][1]) === id) out.push(i + 2);
  }
  return out;
}
/** Dọn các dòng trùng mã bài: mỗi bài giữ 1 dòng đầy đủ nhất (bằng nhau thì lấy dòng mới nhất), sửa lại ô mã thành chữ đúng.
 *  Làm theo lô: ghi lại các dòng giữ lại bằng 1 lệnh rồi xoá phần đuôi bằng 1 lệnh (trước đây xoá từng dòng một, rất chậm khi có nhiều dòng trùng). */
function spgLessonCleanup_() {
  const sh = sheet_('spgLessons'), n = sh.getLastRow(), cols = SHEETS.spgLessons.length;
  if (n < 2) return { ok: true, removed: 0 };
  const vals = sh.getRange(2, 1, n - 1, cols).getValues();
  const best = {}, rowsById = {};
  vals.forEach(function (v, i) {
    if (String(v[0]) === '_settings') return;
    let d = {}; try { d = JSON.parse(v[2] || '{}') || {}; } catch (e) { d = {}; }
    const id = spgRowId_(v[0], d, v[1]);
    if (!id) return;
    d.title = d.title || String(v[1] || '');
    (rowsById[id] = rowsById[id] || []).push(i + 2);
    const sc = spgLessonScore_(d), t = v[3] instanceof Date ? v[3].toISOString() : String(v[3] || '');
    const cur = best[id];
    if (!cur || sc > cur.sc || (sc === cur.sc && t > cur.t)) best[id] = { row: i + 2, sc: sc, t: t, d: d };
  });
  const del = {}; let removed = 0;
  Object.keys(best).forEach(function (id) {
    const b = best[id];
    b.d.id = id; b.d.code = b.d.code || id;
    vals[b.row - 2][0] = id;                          // ô mã là chữ thường
    vals[b.row - 2][2] = JSON.stringify(b.d);
    rowsById[id].forEach(function (r) { if (r !== b.row) { del[r] = true; removed++; } });
  });
  const keep = [], fmt = [];
  vals.forEach(function (v, i) {
    if (del[i + 2]) return;
    keep.push(v);
    if (best[String(v[0])] && best[String(v[0])].row === i + 2) fmt.push('A' + (keep.length + 1));
  });
  if (fmt.length) sh.getRangeList(fmt).setNumberFormat('@');
  sh.getRange(2, 1, keep.length, cols).setValues(keep);
  const tail = n - (keep.length + 1);
  if (tail > 0) {
    try { sh.deleteRows(keep.length + 2, tail); } catch (e) { sh.getRange(keep.length + 2, 1, tail, cols).clearContent(); }
  }
  return { ok: true, removed: removed };
}
function spgLessonDelete_(id) {
  const sh = sheet_('spgLessons'), rows = spgFindLessonRows_(id);
  for (let i = rows.length - 1; i >= 0; i--) sh.deleteRow(rows[i]);
}
function spgSettingsSave_(s) {
  s = s || {};
  const clean = { phrases: spgList_(s.phrases), connectors: spgList_(s.connectors), stressWords: spgList_(s.stressWords), endSounds: spgList_(s.endSounds) };
  upsertRow_('spgLessons', 'id', '_settings', { id: '_settings', title: '_settings', data: JSON.stringify(clean), updated: new Date().toISOString() });
  return { ok: true };
}
function spgResultSave_(r) {
  r = r || {};
  const id = cut_(r.id, 40).trim() || ('r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
  const prow = findRow_('spgResults', 'id', id);
  let prevTime = '';
  if (prow) { const pv = sheet_('spgResults').getRange(prow, 2).getValue(); prevTime = pv instanceof Date ? pv.toISOString() : pv; }
  upsertRow_('spgResults', 'id', id, {
    id: id, time: prow ? prevTime : new Date().toISOString(), student: safe_(cut_(r.student, 60)), lessonId: safe_(cut_(r.lessonId, 40)),
    lessonTitle: safe_(cut_(r.lessonTitle, 120)), total: +r.total || 0, band: safe_(cut_(r.band, 30)), durationSec: +r.durationSec || 0, data: spgShrink_(r.data || {}),
    status: /^(draft|tentative|final)$/.test(String(r.status)) ? r.status : 'draft'
  });
  return { ok: true, id: id };
}
/** danh sách kết quả chấm: chỉ đọc 500 dòng cuối và bỏ cột data (JSON rất nặng) */
function spgResultList_() {
  const sh = sheet_('spgResults'), n = sh.getLastRow();
  if (n < 2) return { ok: true, list: [] };
  const start = Math.max(2, n - 500 + 1), m = n - start + 1;
  const a = sh.getRange(start, 1, m, 8).getValues(), st = sh.getRange(start, SHEETS.spgResults.indexOf('status') + 1, m, 1).getValues();
  const list = a.map(function (r, i) {
    return { id: String(r[0]), time: r[1] instanceof Date ? r[1].toISOString() : r[1], student: String(r[2]), lessonId: String(r[3]), lessonTitle: String(r[4]), total: +r[5], band: String(r[6]), durationSec: +r[7], status: String(st[i][0] || 'draft') };
  });
  return { ok: true, list: list.reverse() };
}
function spgResultGet_(id) {
  const row = findRow_('spgResults', 'id', id);
  if (!row) throw new Error('Không tìm thấy kết quả này');
  const r = rowObj_(SHEETS.spgResults, sheet_('spgResults').getRange(row, 1, 1, SHEETS.spgResults.length).getValues()[0]);
  let data = {}; try { data = JSON.parse(r.data || '{}'); } catch (e) { }
  return { ok: true, item: { id: String(r.id), time: r.time, student: String(r.student), lessonId: String(r.lessonId), lessonTitle: String(r.lessonTitle), total: +r.total, band: String(r.band), durationSec: +r.durationSec, status: String(r.status || 'draft'), data: data } };
}
function deleteRow_(key, col, val) {
  const sh = sheet_(key), n = sh.getLastRow();
  if (n < 2) return;
  const ci = SHEETS[key].indexOf(col) + 1;
  const vals = sh.getRange(2, ci, n - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) { if (String(vals[i][0]) === String(val)) sh.deleteRow(i + 2); }
}
/** thêm hoặc cập nhật 1 dòng theo cột khoá */
function upsertRow_(key, col, val, obj) {
  const sh = sheet_(key), cols = SHEETS[key], n = sh.getLastRow();
  const row = cols.map(function (c) { return obj[c] === undefined ? '' : obj[c]; });
  if (n >= 2) {
    const ci = cols.indexOf(col) + 1;
    const vals = sh.getRange(2, ci, n - 1, 1).getValues();
    for (let i = 0; i < vals.length; i++) {
      if (String(vals[i][0]) === String(val)) { sh.getRange(i + 2, 1, 1, cols.length).setValues([row]); return; }
    }
  }
  sh.appendRow(row);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Chạy hàm này 1 lần trong trình soạn Apps Script để cấp quyền và tạo sẵn các trang tính. */
function thietLapLanDau() {
  Object.keys(SHEETS).forEach(sheet_);
  folder_();
  Logger.log('Xong! Các trang tính và thư mục bài tập đã sẵn sàng.');
}

/** Chạy tay trong trình soạn thảo để kiểm tra quyền gọi Gemini + khoá + model. Không in khoá ra. */
function kiemTraGemini() {
  const key = spgProps_().getProperty('GEMINI_API_KEY');
  if (!key) { Logger.log('Chưa thấy GEMINI_API_KEY trong Thuộc tính tập lệnh (tên khoá không có dấu chấm ở cuối).'); return; }
  const model = String(spgProps_().getProperty('GEMINI_MODEL') || SPG_DEFAULT_MODEL).trim();
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent';
  const r = spgFetch_(url, key, JSON.stringify({ contents: [{ parts: [{ text: 'Reply with the single word OK' }] }] }));
  Logger.log('Model: ' + model + ' | Mã phản hồi: ' + r.code + ' | ' + (r.code === 200 ? 'THÀNH CÔNG, sẵn sàng chấm.' : spgHttpError_(r, model)));
}
