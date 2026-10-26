/**
 * NN Infra — Project N enquiries → Google Sheet
 *
 * Receives JSON from the website's /api/enquiry route and appends one row per
 * enquiry to the "Enquiries" sheet of the spreadsheet this script is bound to.
 *
 * Script Properties (Project Settings → Script Properties):
 *   SHARED_SECRET   required  Must equal GOOGLE_SHEETS_WEBHOOK_SECRET on the website.
 *   NOTIFY_EMAIL    optional  Comma-separated address(es) to email on every new enquiry.
 *   SPREADSHEET_ID  optional  Only for a standalone (unbound) script: the target Sheet's ID.
 *
 * Deploy: Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * After any change: Deploy → Manage deployments → Edit → Version: New version → Deploy.
 */

const SHEET_NAME = 'Enquiries';
const HEADERS = ['Submitted at', 'Name', 'Phone', 'Email', 'Interest', 'Message', 'Consent', 'Page', 'User agent'];
const INTEREST_LABELS = {
  'project-updates': 'Project N updates',
  ownership: 'Fractional ownership details',
  both: 'Both',
};

/** Website → Sheet. Always answers JSON: { ok: true } or { ok: false, error }. */
function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '');
  } catch (err) {
    return respond_({ ok: false, error: 'invalid_json' });
  }
  if (!data || typeof data !== 'object') return respond_({ ok: false, error: 'invalid_json' });

  const props = PropertiesService.getScriptProperties();
  const expected = props.getProperty('SHARED_SECRET');
  if (!expected) return respond_({ ok: false, error: 'not_configured' });
  if (typeof data.secret !== 'string' || !safeEqual_(data.secret, expected)) {
    return respond_({ ok: false, error: 'unauthorized' });
  }
  if (data.consent !== true) return respond_({ ok: false, error: 'consent_required' });
  if (!data.name || !data.phone || !data.email) return respond_({ ok: false, error: 'missing_fields' });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return respond_({ ok: false, error: 'busy' });

  try {
    const sheet = getSheet_(props);
    let submittedAt = new Date(data.submittedAt);
    if (isNaN(submittedAt.getTime())) submittedAt = new Date();

    sheet.appendRow([
      submittedAt,
      text_(data.name, 100),
      text_(data.phone, 20),
      text_(data.email, 254),
      text_(INTEREST_LABELS[data.interest] || data.interest, 60),
      text_(data.message, 1000),
      'Yes',
      text_(data.page, 500),
      text_(data.userAgent, 300),
    ]);
    SpreadsheetApp.flush();
  } catch (err) {
    console.error('Append failed: ' + err);
    return respond_({ ok: false, error: 'write_failed' });
  } finally {
    lock.releaseLock();
  }

  notify_(props, data);
  return respond_({ ok: true });
}

/** Health check: open the web app URL in a browser or curl it. */
function doGet() {
  return respond_({ ok: true, service: 'nn-infra-enquiries' });
}

/**
 * Run once from the editor (select "setup" → Run) to authorise the script and
 * create the "Enquiries" sheet with its header row.
 */
function setup() {
  const sheet = getSheet_(PropertiesService.getScriptProperties());
  console.log('Ready: "' + sheet.getName() + '" in ' + sheet.getParent().getName());
}

/* ---------- helpers ---------- */

function getSheet_(props) {
  const id = props.getProperty('SPREADSHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet: bind this script to a Sheet or set the SPREADSHEET_ID property.');

  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A2:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.setColumnWidth(6, 360); // Message
  }
  return sheet;
}

/**
 * Coerce to a trimmed, length-capped string. Values that Sheets would read as a
 * formula or number (=, +, -, @) get a leading apostrophe so they stay plain text
 * — this also keeps "+91…" phone numbers intact.
 */
function text_(value, max) {
  const s = (value === null || value === undefined ? '' : String(value)).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function notify_(props, data) {
  const to = props.getProperty('NOTIFY_EMAIL');
  if (!to) return;
  try {
    const name = String(data.name || '').slice(0, 100);
    const options = {
      to: to,
      subject: 'New Project N enquiry: ' + name,
      body: [
        'A new Project N enquiry was registered on the website.',
        '',
        'Name: ' + name,
        'Phone: ' + String(data.phone || ''),
        'Email: ' + String(data.email || ''),
        'Interest: ' + (INTEREST_LABELS[data.interest] || String(data.interest || '')),
        'Message: ' + (String(data.message || '').slice(0, 1000) || '(none)'),
        'Page: ' + String(data.page || ''),
        'Submitted at: ' + String(data.submittedAt || ''),
      ].join('\n'),
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || ''))) options.replyTo = String(data.email);
    MailApp.sendEmail(options);
  } catch (err) {
    // The row is already saved; a failed notification must not fail the enquiry.
    console.error('Notification failed: ' + err);
  }
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
