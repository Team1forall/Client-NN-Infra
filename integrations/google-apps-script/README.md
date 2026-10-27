# Project N enquiries → Google Sheet

The website's contact form (Full name, Phone number, Email address, optional Message) posts to `/api/enquiry` (a Next.js route). That route validates the enquiry and forwards it, with a shared secret, to a small Google Apps Script web app (`Code.gs`) that appends a row to a Google Sheet in NN Infra's Google account.

Until the two environment variables below are set, the form stays visible but tells people that online enquiries aren't connected yet and points them to NN Infra's phone, WhatsApp and email instead. Nothing is lost silently.

What the website sends to the script (one JSON object per enquiry):

```json
{
  "secret": "…",
  "submittedAt": "2026-10-27T10:00:00.000Z",
  "name": "Full name",
  "phone": "+919876543210",
  "email": "name@example.com",
  "message": "May be empty",
  "page": "https://…/#contact",
  "userAgent": "…"
}
```

## What you need

- Sign in to Google as the account that owns the leads Sheet:
  <https://docs.google.com/spreadsheets/d/1_gCnrX117143Vm037gMyhLsHSFcOYvKO4rn6e7XRL9A/edit>
- Access to the website's environment variables (`.env.local` locally, and the Vercel project's settings in production).

That Sheet's id is already pinned in [`Code.gs`](./Code.gs) as `DEFAULT_SPREADSHEET_ID`, so the script writes to it whether it is bound to the Sheet or standalone. To point at a different Sheet later, change that constant or set a `SPREADSHEET_ID` Script Property.

## Setup (about 10 minutes)

1. **Open Apps Script.** In the Sheet above: **Extensions → Apps Script**. Delete the sample `myFunction` code, paste the whole of [`Code.gs`](./Code.gs) from this folder, and click **Save**. Name the project, for example "NN Infra enquiries".
2. **Set the shared secret.** **Project Settings** (gear icon) → **Script Properties** → **Add script property**:
   - `SHARED_SECRET` = the value of `GOOGLE_SHEETS_WEBHOOK_SECRET` in `.env.local` (required — copy it exactly, no surrounding spaces)
   - `NOTIFY_EMAIL` = an address to email on every new lead (optional; comma-separate several)
   - Save.

   There is already a secret in `.env.local`; reuse it so local development and production agree. To mint a fresh one instead, generate it and put the same value in all three places (`.env.local`, Vercel, and this property):
   - Git Bash: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
   - PowerShell: `-join (1..2 | ForEach-Object { [guid]::NewGuid().ToString('N') })`
3. **Authorise and create the tab.** In the editor, choose the function **`setup`** in the toolbar and click **Run**. Google asks for permission (to edit the spreadsheet and send email as you). Because the script is private, Google shows "Google hasn't verified this app": choose **Advanced → Go to … (unsafe)** → **Allow**. A tab called **Enquiries** appears with a bold, frozen header row: Submitted at, Name, Phone, Email, Message, Page, User agent. Your existing first tab is left alone.
4. **Deploy as a web app.** **Deploy → New deployment** → gear next to "Select type" → **Web app**:
   - Description: `Project N enquiries`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

   "Anyone" only means the URL can be called without a Google login; every request must still carry the shared secret, and the script never returns Sheet data.
5. **Connect the website.** Put the URL in `.env.local`:

   ```
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
   ```

   and add both variables to the Vercel project (**Settings → Environment Variables**, Production + Preview + Development):

   | Name | Value |
   | --- | --- |
   | `GOOGLE_SHEETS_WEBHOOK_URL` | the `/exec` URL from step 4 |
   | `GOOGLE_SHEETS_WEBHOOK_SECRET` | the same string as the `SHARED_SECRET` property |

   Restart `npm run dev` locally, and **redeploy** on Vercel — environment variables are read at build and run time, so an existing deployment will not pick them up on its own. Never prefix either name with `NEXT_PUBLIC_`.
6. **Test** (below), then submit the real form once and check that a row appears.

## Changing the script later

Edit `Code.gs`, save, then **Deploy → Manage deployments → (pencil) Edit → Version: New version → Deploy**. This keeps the same `/exec` URL. Choosing **New deployment** instead creates a new URL, which you would then have to copy into `GOOGLE_SHEETS_WEBHOOK_URL` again.

**Upgrading from the earlier form (Interest and Consent columns).** The script only writes the header row when the **Enquiries** tab is empty, so an existing tab keeps the old nine-column header and new rows would sit under the wrong headings. Rename the old tab (for example "Enquiries (old)"), paste the new `Code.gs`, run **`setup`** once to create a fresh **Enquiries** tab with the new header, then publish a new version as above.

## Testing

Health check (should print `{"ok":true,"service":"nn-infra-enquiries"}`):

```bash
curl -sL "https://script.google.com/macros/s/XXXXXXXX/exec"
```

Append a test row directly to the Sheet. Use `--data` and `-L` but **not** `-X POST`: Apps Script answers with a 302 redirect, and curl must follow it with a GET.

```bash
curl -sL "https://script.google.com/macros/s/XXXXXXXX/exec" \
  -H "Content-Type: application/json" \
  --data '{"secret":"YOUR_SECRET","submittedAt":"2026-10-26T10:00:00.000Z","name":"Test Enquiry","phone":"+919876543210","email":"test@example.com","message":"Test row - please delete","page":"curl test","userAgent":"curl"}'
```

PowerShell equivalent:

```powershell
$body = '{"secret":"YOUR_SECRET","submittedAt":"2026-10-26T10:00:00.000Z","name":"Test Enquiry","phone":"+919876543210","email":"test@example.com","message":"Test row - please delete","page":"powershell test","userAgent":"powershell"}'
Invoke-RestMethod -Method Post -Uri "https://script.google.com/macros/s/XXXXXXXX/exec" -ContentType "application/json" -Body $body
```

Through the website's own API (with `npm run dev` running):

```bash
curl -s http://localhost:3000/api/enquiry \
  -H "Content-Type: application/json" \
  --data '{"name":"Test Enquiry","phone":"98765 43210","email":"test@example.com","message":""}'
```

Expected answers from `/api/enquiry`:

| Response | Meaning |
| --- | --- |
| `200 {"ok":true}` | Saved to the Sheet |
| `422 {"ok":false,"code":"invalid","fields":{…}}` | A field failed validation |
| `429 {"ok":false,"code":"rate_limited"}` | More than 5 enquiries from one address in 10 minutes |
| `503 {"ok":false,"code":"not_configured"}` | `GOOGLE_SHEETS_WEBHOOK_URL` or `GOOGLE_SHEETS_WEBHOOK_SECRET` is not set |
| `502 {"ok":false,"code":"upstream"}` | The script refused or failed; the reason is in the server log |

## Troubleshooting

- **`502` and the server log says `unauthorized`:** `GOOGLE_SHEETS_WEBHOOK_SECRET` and the `SHARED_SECRET` Script Property don't match exactly (check for spaces).
- **`502` with `non-JSON body` in the log:** the deployment isn't set to *Who has access: Anyone*, or the script hasn't been authorised (run `setup` again), or the URL is the editor URL rather than the `/exec` URL.
- **`502` with `not_configured`:** the `SHARED_SECRET` Script Property is missing.
- **Changes to `Code.gs` have no effect:** publish a new version of the existing deployment (see "Changing the script later").
- **No notification email:** check `NOTIFY_EMAIL`; consumer Google accounts can send about 100 script emails a day. The row is saved even if the email fails.

## Data handling

The Sheet holds personal data (names, phone numbers, email addresses and messages). Keep sharing limited to the enquiries team, and delete rows when a person asks or when they are no longer needed, as described in the website's privacy notice (`/privacy`).
