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
  submissions: ['time', 'name', 'hwId', 'hwTitle', 'attempt', 'score', 'max', 'scaled', 'durationSec']
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
  const role = roleOf_(b);
  if (b.action === 'login') {
    if (!role) throw new Error('Sai mật khẩu');
    if (role === 'student' && !String(b.name || '').trim()) throw new Error('Nhập tên của em nhé');
    return { ok: true, role: role };
  }
  if (!role) throw new Error('Sai mật khẩu hoặc phiên đã hết hạn');
  const teacher = role === 'teacher';
  const needT = function () { if (!teacher) throw new Error('Chỉ dành cho cô giáo'); };
  const name = String(b.name || '').trim();

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
    case 'hwSave': needT(); return hwSave_(b.hw);
    case 'hwList': return hwList_(name, teacher);
    case 'hwGet': return hwGet_(b.id, teacher);
    case 'hwSubmit': return hwSubmit_(name, b, teacher);
    case 'hwMine': return { ok: true, subs: rows_('submissions').filter(function (r) { return r.hwId === b.id && r.name === name; }) };
    case 'hwResults': needT(); return { ok: true, subs: rows_('submissions').filter(function (r) { return r.hwId === b.id; }) };
    case 'hwDelete': needT(); return hwDelete_(b.id);
    case 'hwSetOpen': needT(); return hwSetOpen_(b.id, !!b.open);
  }
  throw new Error('Hành động không hợp lệ: ' + b.action);
}

function roleOf_(b) {
  const pw = String(b.pw || '');
  if (pw && pw === TEACHER_PASSWORD) return 'teacher';
  if (pw && pw === STUDENT_PASSWORD) return 'student';
  return '';
}

/* ---------- bảng tính ---------- */
function sheet_(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(key);
  if (!sh) {
    sh = ss.insertSheet(key);
    sh.getRange(1, 1, 1, SHEETS[key].length).setValues([SHEETS[key]]).setFontWeight('bold');
    sh.setFrozenRows(1);
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
    const mine = subs.filter(function (s) { return s.hwId === r.id; });
    const best = mine.length ? Math.max.apply(null, mine.map(function (s) { return +s.scaled || 0; })) : null;
    return Object.assign({}, meta, { id: r.id, title: r.title, curId: r.curId, unitId: r.unitId, open: r.open === true, created: r.created, myAttempts: mine.length, myBest: best });
  });
  list.sort(function (a, c) { return String(c.created).localeCompare(String(a.created)); });
  return { ok: true, list: list };
}
function hwGet_(id, teacher) {
  const f = findHwRow_(id);
  if (!f) throw new Error('Không tìm thấy bài tập');
  const cols = SHEETS.homework, r = f.sh.getRange(f.row, 1, 1, cols.length).getValues()[0];
  if (!teacher && r[cols.indexOf('open')] !== true) throw new Error('Bài tập đang đóng');
  const hw = JSON.parse(DriveApp.getFileById(r[cols.indexOf('fileId')]).getBlob().getDataAsString());
  hw.open = r[cols.indexOf('open')] === true;
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
