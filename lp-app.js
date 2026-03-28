/* ========================================
   NUCHIGUSUI LP — アクセスバーズ
   ======================================== */

// FAQ
document.querySelectorAll('.lp-faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.lp-faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ヘッダースクロール
const lpHeader = document.getElementById('lpHeader');
if (lpHeader) {
  window.addEventListener('scroll', () => {
    lpHeader.style.boxShadow = window.scrollY > 40 ? '0 2px 20px rgba(0,0,0,0.3)' : '';
  }, { passive: true });
}

// ========== カレンダー ==========
const today = new Date();
today.setHours(0,0,0,0);
let curYear = today.getFullYear();
let curMonth = today.getMonth();
let lpSelectedDate = null;
let lpSelectedTime = null;

function lpAvailability(year, month) {
  const data = {};
  const dim = new Date(year, month+1, 0).getDate();
  for (let d = 1; d <= dim; d++) {
    const dt = new Date(year, month, d);
    if (dt <= today) continue;
    if (dt.getDay() === 0) { data[d] = 'closed'; continue; }
    const r = Math.random();
    data[d] = r < 0.12 ? 'full' : r < 0.3 ? 'few' : 'available';
  }
  return data;
}

function renderLpCalendar(year, month) {
  const avail = lpAvailability(year, month);
  const mn = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  document.getElementById('lpCalTitle').textContent = `${year}年 ${mn[month]}`;
  const body = document.getElementById('lpCalBody');
  body.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const dim = new Date(year, month+1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div'); e.className = 'lp-cal-day empty'; body.appendChild(e);
  }
  for (let d = 1; d <= dim; d++) {
    const date = new Date(year, month, d);
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = date.getDay();
    const isPast = date <= today;
    const status = avail[d];
    const cell = document.createElement('div');
    cell.className = 'lp-cal-day';
    if (dow===0) cell.classList.add('sunday');
    if (dow===6) cell.classList.add('saturday');
    if (isPast || status==='closed') {
      cell.classList.add('past');
      cell.innerHTML = `<span class="dn">${d}</span>`;
    } else if (status==='full') {
      cell.classList.add('full');
      cell.innerHTML = `<span class="dn">${d}</span><div class="d"></div>`;
    } else {
      cell.classList.add(status);
      cell.innerHTML = `<span class="dn">${d}</span><div class="d"></div>`;
      cell.addEventListener('click', () => {
        document.querySelectorAll('.lp-cal-day').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        lpSelectedDate = ds;
        const [y,m,dd] = ds.split('-');
        const dow2 = ['日','月','火','水','木','金','土'][new Date(ds).getDay()];
        document.getElementById('lpSelectedDate').textContent = `📅 ${y}年${parseInt(m)}月${parseInt(dd)}日（${dow2}）`;
        showTimeSlots(ds);
      });
    }
    if (lpSelectedDate === ds) cell.classList.add('selected');
    body.appendChild(cell);
  }
}

document.getElementById('lpPrevMonth').addEventListener('click', () => {
  curMonth--; if (curMonth<0){curMonth=11;curYear--;}
  renderLpCalendar(curYear, curMonth);
  lpSelectedDate = null; document.getElementById('lpSelectedDate').textContent = '日付を選択してください';
  document.getElementById('lpTimeSlotsWrap').style.display = 'none';
});
document.getElementById('lpNextMonth').addEventListener('click', () => {
  curMonth++; if (curMonth>11){curMonth=0;curYear++;}
  renderLpCalendar(curYear, curMonth);
  lpSelectedDate = null; document.getElementById('lpSelectedDate').textContent = '日付を選択してください';
  document.getElementById('lpTimeSlotsWrap').style.display = 'none';
});

const TIMES = ['10:00','11:30','13:00','14:30','16:00','17:30'];
function showTimeSlots(ds) {
  const wrap = document.getElementById('lpTimeSlotsWrap');
  const container = document.getElementById('lpTimeSlots');
  container.innerHTML = '';
  lpSelectedTime = null;
  wrap.style.display = 'block';
  const seed = ds.split('-').reduce((a,b)=>a+parseInt(b),0);
  TIMES.forEach(t => {
    const booked = seed%7!==0 && Math.random()<0.3;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lp-time-slot' + (booked?' booked':'');
    btn.innerHTML = `${t}<small>${booked?'満':'○'}</small>`;
    btn.style.border = 'none';
    if (!booked) {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lp-time-slot').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        lpSelectedTime = t;
      });
    }
    container.appendChild(btn);
  });
}

renderLpCalendar(curYear, curMonth);

// ========== フォーム送信 ==========
document.getElementById('lpSubmit').addEventListener('click', () => {
  const name = document.getElementById('lpName').value.trim();
  const phone = document.getElementById('lpPhone').value.trim();
  const email = document.getElementById('lpEmail').value.trim();

  if (!name) { alert('お名前をご入力ください。'); return; }
  if (!phone) { alert('電話番号をご入力ください。'); return; }
  if (!email) { alert('メールアドレスをご入力ください。'); return; }
  if (!/^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email)) { alert('メールアドレスの形式が正しくありません。'); return; }
  if (!lpSelectedDate) { alert('ご希望の日付を選択してください。'); return; }
  if (!lpSelectedTime) { alert('ご希望の時間を選択してください。'); return; }

  const btn = document.getElementById('lpSubmit');
  btn.textContent = '送信中...'; btn.disabled = true;

  setTimeout(() => {
    document.querySelector('.lp-form-wrap').style.display = 'none';
    document.getElementById('lpComplete').style.display = 'block';
    document.getElementById('lpComplete').scrollIntoView({ behavior: 'smooth' });
  }, 1200);
});
