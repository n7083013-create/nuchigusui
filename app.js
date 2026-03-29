/* ========================================
   NUCHIGUSUI — App JS (World-Class)
   ======================================== */

// ========== ローダー ==========
window.addEventListener('load', () => {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('exit');
    document.body.classList.remove('loading');

    // ヒーローアニメーション起動
    setTimeout(() => {
      document.querySelectorAll('.hero-eyebrow, .hero-sub').forEach(el => el.classList.add('visible'));
      document.querySelector('.split-word')?.classList.add('visible');
      setTimeout(() => {
        document.querySelector('.hero-kana')?.classList.add('visible');
        document.querySelector('.hero-actions')?.classList.add('visible');
      }, 300);
    }, 200);

    setTimeout(() => {
      loader.classList.add('done');
    }, 1000);
  }, 2200);
});

// ========== カスタムカーソル ==========
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ホバー時カーソル変化
document.querySelectorAll('a, button, .menu-select-card, .cal-day, .time-slot, .faq-q').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ========== マグネティックボタン ==========
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ========== ヘッダースクロール ==========
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ========== ハンバーガー ==========
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    spans[1].style.cssText = 'opacity:0';
    spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// ========== パーティクル生成 ==========
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ========== スクロールアニメーション ==========
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// スタッガー付きで監視
document.querySelectorAll('.fade-up').forEach((el, i) => {
  // 同じ親を持つ要素にスタッガーを適用
  const siblings = el.parentElement?.querySelectorAll('.fade-up');
  if (siblings && siblings.length > 1) {
    const idx = Array.from(siblings).indexOf(el);
    el.style.transitionDelay = `${idx * 0.1}s`;
  }
  fadeObserver.observe(el);
});

// ========== カウンターアニメーション ==========
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(el => countObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ========== FAQ ==========
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ========================================
//   予約システム
// ========================================

// Google Calendar API設定
const GCAL_CALENDAR_ID = 'c_47081a0e67f736c29579251b8bc3e126afb40a011714c54193fcb55355633d68@group.calendar.google.com';
const GCAL_API_KEY = 'YOUR_GOOGLE_CALENDAR_API_KEY'; // ← APIキーをここに入れる

// 終日イベント（休み）の日付を取得してキャッシュ
const blockedDatesCache = {};

async function fetchBlockedDates(year, month) {
  const cacheKey = `${year}-${month}`;
  if (blockedDatesCache[cacheKey]) return blockedDatesCache[cacheKey];
  if (GCAL_API_KEY === 'YOUR_GOOGLE_CALENDAR_API_KEY') return new Set();

  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  const calId = encodeURIComponent(GCAL_CALENDAR_ID);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calId}/events?key=${GCAL_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&maxResults=50`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const blocked = new Set();
    (data.items || []).forEach(ev => {
      // 終日イベントは start.date があり start.dateTime がない
      if (ev.start && ev.start.date && !ev.start.dateTime) {
        // 複数日にまたがる終日イベントにも対応
        const start = new Date(ev.start.date);
        const end = new Date(ev.end.date); // Googleカレンダーのend.dateは翌日なので <end で処理
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          blocked.add(d.toISOString().slice(0, 10));
        }
      }
    });
    blockedDatesCache[cacheKey] = blocked;
    return blocked;
  } catch (e) {
    console.warn('カレンダー取得失敗:', e);
    return new Set();
  }
}

let selectedMenu = null, selectedDate = null, selectedTime = null;
const today = new Date();
today.setHours(0, 0, 0, 0);
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

// --- 予約受付ルール ---
// 当日予約不可 / 前日21時以降は翌日も不可
const now = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().slice(0, 10);
const isTomorrowBlocked = now.getHours() >= 21; // 21時以降は翌日受付停止

// 営業時間：10:00〜最終受付16:00
const ALL_TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00'];

// --- 空き状況 ---
function generateAvailability(year, month) {
  const data = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (date <= today) continue; // 当日・過去は不可
    if (isTomorrowBlocked && dateStr === tomorrowStr) { data[d] = 'closed'; continue; } // 21時以降は翌日不可
    if (date.getDay() === 0) { data[d] = 'closed'; continue; }
    // APIキー設定前はランダム表示（仮）、設定後はカレンダー実データで上書き
    data[d] = 'available';
  }
  return data;
}

// --- カレンダーから時間帯の予約済みスロットを取得（ダブルブッキング防止）---
const bookedSlotsCache = {};

async function fetchBookedTimeSlots(dateStr) {
  if (bookedSlotsCache[dateStr]) return bookedSlotsCache[dateStr];
  if (GCAL_API_KEY === 'YOUR_GOOGLE_CALENDAR_API_KEY') return new Set();

  const timeMin = `${dateStr}T00:00:00+09:00`;
  const timeMax = `${dateStr}T23:59:59+09:00`;
  const calId = encodeURIComponent(GCAL_CALENDAR_ID);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calId}/events?key=${GCAL_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&maxResults=20`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const booked = new Set();
    (data.items || []).forEach(ev => {
      if (ev.start && ev.start.dateTime) {
        // 時間帯イベント → 重なるスロットをブロック
        const evStart = new Date(ev.start.dateTime);
        const evEnd = new Date(ev.end.dateTime);
        ALL_TIMES.forEach(slot => {
          const [sh, sm] = slot.split(':').map(Number);
          const slotTime = new Date(evStart);
          slotTime.setHours(sh, sm, 0, 0);
          // スロット開始がイベント期間内に含まれる場合はブロック
          if (slotTime >= evStart && slotTime < evEnd) booked.add(slot);
        });
      }
    });
    bookedSlotsCache[dateStr] = booked;
    return booked;
  } catch (e) {
    console.warn('時間スロット取得失敗:', e);
    return new Set();
  }
}

// --- カレンダー ---
async function renderCalendar(year, month) {
  const avail = generateAvailability(year, month);
  const blocked = await fetchBlockedDates(year, month);
  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  document.getElementById('calTitle').textContent = `${year}年 ${monthNames[month]}`;
  const body = document.getElementById('calendarBody');
  body.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div'); e.className = 'cal-day empty'; body.appendChild(e);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = date.getDay();
    const isPast = date <= today;
    const isBlocked = blocked.has(dateStr); // 終日イベント（休み）チェック
    const status = avail[d];
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    if (dow === 0) cell.classList.add('sunday');
    if (dow === 6) cell.classList.add('saturday');
    if (isPast || status === 'closed' || isBlocked) {
      cell.classList.add('past');
      const label = isBlocked ? '<small style="font-size:.55rem;color:#ccc">休</small>' : (status === 'closed' ? '<small style="font-size:.55rem;color:#ccc">休</small>' : '');
      cell.innerHTML = `<span class="day-num">${d}</span>${label}`;
    } else if (status === 'full') {
      cell.classList.add('full');
      cell.innerHTML = `<span class="day-num">${d}</span><div class="dot"></div>`;
    } else {
      cell.classList.add(status);
      cell.innerHTML = `<span class="day-num">${d}</span><div class="dot"></div>`;
      cell.addEventListener('click', () => {
        document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedDate = dateStr;
        document.getElementById('step2Next').disabled = false;
      });
    }
    if (selectedDate === dateStr) cell.classList.add('selected');
    body.appendChild(cell);
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar(currentYear, currentMonth);
  selectedDate = null; document.getElementById('step2Next').disabled = true;
});
document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar(currentYear, currentMonth);
  selectedDate = null; document.getElementById('step2Next').disabled = true;
});

// --- 時間スロット（カレンダー実データでブロック）---
async function renderTimeSlots(dateStr) {
  const container = document.getElementById('timeSlots');
  container.innerHTML = '<p style="text-align:center;color:#999;font-size:.85rem;padding:16px">読み込み中...</p>';
  selectedTime = null;
  document.getElementById('step3Next').disabled = true;

  const bookedSlots = await fetchBookedTimeSlots(dateStr);

  container.innerHTML = '';
  ALL_TIMES.forEach(time => {
    const isBooked = bookedSlots.has(time);
    const btn = document.createElement('button');
    btn.className = 'time-slot' + (isBooked ? ' booked' : '');
    btn.innerHTML = `${time}<small>${isBooked ? '満' : '○'}</small>`;
    if (!isBooked) {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTime = time;
        document.getElementById('step3Next').disabled = false;
      });
    }
    container.appendChild(btn);
  });
}

// --- ステップ制御 ---
function goToStep(n) {
  document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step${n}`).classList.add('active');
  document.querySelectorAll('.booking-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < n) s.classList.add('done');
    if (i + 1 === n) s.classList.add('active');
  });
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// STEP1
document.querySelectorAll('input[name="menu"]').forEach(r => {
  r.addEventListener('change', () => {
    const card = r.closest('.menu-select-card');
    selectedMenu = { value: r.value, name: card.querySelector('strong').textContent, time: r.dataset.time, price: r.dataset.price };
    document.getElementById('step1Next').disabled = false;
  });
});
document.getElementById('step1Next').addEventListener('click', () => {
  if (!selectedMenu) return;
  goToStep(2); renderCalendar(currentYear, currentMonth);
});

// STEP2
document.getElementById('step2Next').addEventListener('click', () => {
  if (!selectedDate) return;
  const [y, m, d] = selectedDate.split('-');
  const dow = ['日','月','火','水','木','金','土'][new Date(selectedDate).getDay()];
  document.getElementById('selectedDateDisplay').textContent = `📅  ${y}年${parseInt(m)}月${parseInt(d)}日（${dow}）`;
  renderTimeSlots(selectedDate);
  goToStep(3);
});
document.getElementById('step2Back').addEventListener('click', () => goToStep(1));

// STEP3
document.getElementById('step3Next').addEventListener('click', () => { if (!selectedTime) return; goToStep(4); });
document.getElementById('step3Back').addEventListener('click', () => goToStep(2));

// STEP4
document.getElementById('step4Next').addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const nameKana = document.getElementById('customerNameKana').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  if (!name || !nameKana || !phone || !email) { alert('必須項目をすべてご入力ください。'); return; }
  if (!/^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email)) { alert('メールアドレスの形式が正しくありません。'); return; }
  const visitVal = document.querySelector('input[name="visit"]:checked').value;
  const note = document.getElementById('customerNote').value.trim();
  const [y, m, d] = selectedDate.split('-');
  const dow = ['日','月','火','水','木','金','土'][new Date(selectedDate).getDay()];
  document.getElementById('confirmMenu').textContent = `${selectedMenu.name}（${selectedMenu.time} / ${selectedMenu.price}）`;
  document.getElementById('confirmDatetime').textContent = `${y}年${parseInt(m)}月${parseInt(d)}日（${dow}） ${selectedTime}〜`;
  document.getElementById('confirmName').textContent = `${name}（${nameKana}）`;
  document.getElementById('confirmPhone').textContent = phone;
  document.getElementById('confirmEmail').textContent = email;
  document.getElementById('confirmVisit').textContent = visitVal === 'first' ? '初めて' : 'リピーター';
  const noteRow = document.getElementById('confirmNoteRow');
  if (note) { document.getElementById('confirmNote').textContent = note; noteRow.style.display = 'flex'; }
  else { noteRow.style.display = 'none'; }
  goToStep(5);
});
document.getElementById('step4Back').addEventListener('click', () => goToStep(3));

// STEP5
document.getElementById('step5Back').addEventListener('click', () => goToStep(4));
document.getElementById('confirmBtn').addEventListener('click', async () => {
  const btn = document.getElementById('confirmBtn');
  btn.textContent = '送信中...'; btn.disabled = true;

  // 送信するデータを収集（送信後に消去）
  const bookingData = {
    menu: selectedMenu.name,
    date: selectedDate,
    time: selectedTime,
    duration: selectedMenu.time,
    name: document.getElementById('customerName').value.trim(),
    nameKana: document.getElementById('customerNameKana').value.trim(),
    phone: document.getElementById('customerPhone').value.trim(),
    email: document.getElementById('customerEmail').value.trim(),
    visit: document.querySelector('input[name="visit"]:checked').value,
    note: document.getElementById('customerNote').value.trim()
  };

  // TODO: Google Apps Script エンドポイントに送信（設定後に有効化）
  // const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
  // try {
  //   const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(bookingData) });
  //   const result = await res.json();
  //   if (!result.success) { btn.textContent = '予約を確定する ✓'; btn.disabled = false; alert(result.message); return; }
  // } catch (e) { btn.textContent = '予約を確定する ✓'; btn.disabled = false; alert('送信エラーが発生しました。再度お試しください。'); return; }

  // 完了表示
  await new Promise(r => setTimeout(r, 1000));
  document.getElementById('confirmView').classList.add('hidden');
  document.getElementById('completeView').classList.remove('hidden');
  const [y, m, d] = selectedDate.split('-');
  const dow = ['日','月','火','水','木','金','土'][new Date(selectedDate).getDay()];
  document.getElementById('completeSummary').innerHTML = `
    <div><strong>メニュー：</strong>${bookingData.menu}</div>
    <div><strong>日時：</strong>${y}年${parseInt(m)}月${parseInt(d)}日（${dow}） ${selectedTime}〜</div>
    <div><strong>お名前：</strong>${bookingData.name} 様</div>
  `;
  document.querySelectorAll('.booking-step').forEach(s => s.classList.add('done'));
  document.querySelector('[data-step="5"]').classList.add('active');

  // セキュリティ：送信完了後にフォームの個人情報をメモリから消去
  ['customerName','customerNameKana','customerPhone','customerEmail','customerNote'].forEach(id => {
    document.getElementById(id).value = '';
  });
});

function resetBooking() {
  selectedMenu = null; selectedDate = null; selectedTime = null;
  currentYear = today.getFullYear(); currentMonth = today.getMonth();
  document.querySelectorAll('input[name="menu"]').forEach(r => r.checked = false);
  document.getElementById('bookingForm').reset();
  ['step1Next','step2Next','step3Next'].forEach(id => document.getElementById(id).disabled = true);
  document.getElementById('confirmView').classList.remove('hidden');
  document.getElementById('completeView').classList.add('hidden');
  document.getElementById('confirmBtn').textContent = '予約を確定する ✓';
  document.getElementById('confirmBtn').disabled = false;
  goToStep(1);
}
window.resetBooking = resetBooking;

renderCalendar(currentYear, currentMonth);
