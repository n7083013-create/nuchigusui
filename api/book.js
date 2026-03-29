const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const BOOKING_DB_ID = process.env.NOTION_BOOKING_DB_ID;

module.exports = async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, nameKana, phone, email, date, time, menu, visit, note } = req.body;

  // 入力バリデーション
  if (!name || !nameKana || !phone || !email || !date || !time || !menu) {
    return res.status(400).json({ error: '必須項目が不足しています。' });
  }

  // メール形式チェック
  if (!/^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'メールアドレスの形式が正しくありません。' });
  }

  // 予約日チェック（当日・過去は不可）
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(date);
  if (bookingDate <= today) {
    return res.status(400).json({ error: '当日・過去の日付は予約できません。' });
  }

  // 前日21時以降は翌日予約不可
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  if (date === tomorrowStr && new Date().getHours() >= 21) {
    return res.status(400).json({ error: '前日21時以降は翌日のご予約を受け付けていません。' });
  }

  try {
    // ── ダブルブッキングチェック ──────────────────────────
    const existing = await notion.databases.query({
      database_id: BOOKING_DB_ID,
      filter: {
        and: [
          { property: '予約日', date: { equals: date } },
          { property: '時間帯', select: { equals: time } },
          { property: '対応ステータス', select: { does_not_equal: 'キャンセル' } },
        ],
      },
    });

    if (existing.results.length > 0) {
      return res.status(409).json({
        error: 'この時間帯はすでに予約が入っています。別の日時をお選びください。',
      });
    }

    // ── Notionに予約を登録 ────────────────────────────────
    await notion.pages.create({
      parent: { database_id: BOOKING_DB_ID },
      properties: {
        'お名前':       { title: [{ text: { content: `${name}（${nameKana}）` } }] },
        '予約日':       { date: { start: date } },
        '時間帯':       { select: { name: time } },
        'メニュー':     { select: { name: menu } },
        '対応ステータス': { select: { name: '確定' } },
        '電話番号':     { phone_number: phone },
        'メールアドレス': { email: email },
        '初回・リピート': { select: { name: visit === 'first' ? '初めて' : 'リピーター' } },
        'ご要望':       { rich_text: [{ text: { content: note || '' } }] },
      },
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Booking error:', err.message);
    return res.status(500).json({ error: '予約処理中にエラーが発生しました。しばらく経ってから再度お試しください。' });
  }
};
