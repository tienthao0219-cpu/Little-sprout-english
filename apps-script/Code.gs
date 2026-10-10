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
  answers: ['time', 'name', 'source', 'sourceId', 'attempt', 'topic', 'qid', 'ok', 'q'],
  homework: ['id', 'title', 'curId', 'unitId', 'open', 'created', 'updated', 'meta', 'fileId'],
  submissions: ['time', 'name', 'hwId', 'hwTitle', 'attempt', 'score', 'max', 'scaled', 'durationSec'],
  students: ['name', 'code', 'active', 'created', 'note'],
  appAssign: ['appId', 'names', 'updated'],
  profiles: ['name', 'data', 'updated']
};
const MAX_REPORT_ANSWERS = 8000;

function doGet() {
  return json_({ ok: true, service: 'Little Sprout English', note: 'Dùng POST. Mở trang web của lớp để sử dụng.' });
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Dữ liệu gửi lên không hợp lệ' }); }
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
      answers: rows_('answers').slice(-MAX_REPORT_ANSWERS)
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
function students_() { return rows_('students'); }
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
  const all = students_();
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
  return { ok: true, count: items.length };
}
function studentDelete_(name) {
  const sh = sheet_('students'), n = sh.getLastRow();
  if (n < 2) return { ok: true };
  const vals = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) if (sameName_(vals[i][0], name)) sh.deleteRow(i + 2);
  return { ok: true };
}


/* ---------- hồ sơ học viên: xu, avatar, thú nuôi, nhiệm vụ... (mỗi em một dòng trong trang tính "profiles") ---------- */
const PROFILE_MAX_BYTES = 45000;
const MAX_COIN_DELTA = 400;   // mỗi lần đồng bộ, số xu tăng thêm tối đa (chặn gian lận kiểu sửa số xu bằng F12)
function profileRow_(name) {
  const sh = sheet_('profiles'), n = sh.getLastRow();
  if (n < 2) return null;
  const vals = sh.getRange(2, 1, n - 1, 3).getValues();
  for (let i = 0; i < vals.length; i++) if (sameName_(vals[i][0], name)) return { sh: sh, row: i + 2, data: parseObj_(vals[i][1]) };
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
  return out;
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
    return { name: String(r.name), coins: d.coins || 0, earned: d.earned || 0, pet: pet.kind || '', petXp: pet.xp || 0, streak: st.n || 0, lastDay: st.last || '', updated: r.updated };
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
function sheet_(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(key);
  if (!sh) {
    sh = ss.insertSheet(key);
    sh.getRange(1, 1, 1, SHEETS[key].length).setValues([SHEETS[key]]).setFontWeight('bold');
    sh.setFrozenRows(1);
    if (key === 'students') sh.getRange('B:B').setNumberFormat('@'); // giữ mã dạng chữ (không bị đổi thành số)
  }
  return sh;
}
function rows_(key) {
  const sh = sheet_(key), n = sh.getLastRow();
  if (n < 2) return [];
  const cols = SHEETS[key], vals = sh.getRange(2, 1, n - 1, cols.length).getValues();
  return vals.map(function (r) {
    const o = {};
    cols.forEach(function (c, i) { o[c] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    return o;
  });
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
  const sh = sheet_('plays'), n = sh.getLastRow();
  let rowIdx = -1, attempt = 0;
  if (n >= 2) {
    const vals = sh.getRange(2, 1, n - 1, SHEETS.plays.length).getValues(), cols = SHEETS.plays;
    const iSid = cols.indexOf('sid'), iName = cols.indexOf('name'), iApp = cols.indexOf('appId');
    for (let i = 0; i < vals.length; i++) {
      if (vals[i][iName] === name && vals[i][iApp] === p.appId) {
        attempt = Math.max(attempt, +vals[i][cols.indexOf('attempt')] || 0);
        if (p.sid && vals[i][iSid] === p.sid) { rowIdx = i + 2; attempt = +vals[i][cols.indexOf('attempt')]; break; }
      }
    }
  }
  const score = +p.score || 0, max = +p.max || 0, pct = max ? Math.round(100 * score / max) : '';
  if (rowIdx > 0) {
    const cols = SHEETS.plays;
    sh.getRange(rowIdx, cols.indexOf('updated') + 1).setValue(now);
    sh.getRange(rowIdx, cols.indexOf('score') + 1, 1, 4).setValues([[score, max, pct, +p.durationSec || 0]]);
  } else {
    attempt = attempt + 1;
    append_('plays', { sid: cut_(p.sid, 40), time: now, updated: now, name: name, appId: cut_(p.appId, 80), appTitle: safe_(cut_(p.appTitle, 120)), cur: cut_(p.cur, 60), unit: cut_(p.unit, 80), attempt: attempt, score: score, max: max, pct: pct, durationSec: +p.durationSec || 0 });
  }
  appendMany_('answers', (answers || []).slice(0, 600).map(function (a) {
    return { time: now, name: name, source: 'app', sourceId: cut_(p.appId, 80), attempt: attempt, topic: safe_(cut_(a.topic, 120)), qid: cut_(a.qid, 80), ok: !!a.ok, q: safe_(cut_(a.q, 160)) };
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
  const mine = rows_('submissions').filter(function (s) { return s.hwId === b.id && s.name === name; });
  if (meta.maxAttempts && mine.length >= meta.maxAttempts && !teacher) throw new Error('Em đã hết lượt làm bài này');
  const attempt = mine.length + 1, score = +b.score || 0, max = +b.max || 0;
  const scaled = max ? Math.round(score / max * (meta.scale || 10) * 100) / 100 : 0;
  const now = new Date().toISOString();
  append_('submissions', { time: now, name: name, hwId: b.id, hwTitle: r[cols.indexOf('title')], attempt: attempt, score: score, max: max, scaled: scaled, durationSec: +b.durationSec || 0 });
  appendMany_('answers', (b.items || []).slice(0, 800).map(function (a) {
    return { time: now, name: name, source: 'hw', sourceId: b.id, attempt: attempt, topic: safe_(cut_(a.topic, 120)), qid: cut_(a.qid, 80), ok: !!a.ok, q: safe_(cut_(a.q, 160)) };
  }));
  return { ok: true, attempt: attempt, scaled: scaled };
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
