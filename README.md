# DECOR Visiting Card Maker

A small web page that generates the **front (details) side** of the
DECOR Energy Solutions and Development Limited visiting card as a PNG.

Type a name, education, designation, phone and email → the card preview
updates live → click **Download PNG** (1600 × 914 px, same size as the
original artwork).

Everything runs in the browser. No server, no database, nothing is uploaded.

---

## Put it online with GitHub Pages (free live link)

1. Sign in to GitHub and create a **new repository**, e.g. `decor-card-maker`
   (Public — GitHub Pages is free for public repos).
2. On the new repo page click **“uploading an existing file”**.
3. Unzip `decor-card-generator.zip` and drag **everything inside the folder**
   (`index.html`, `style.css`, `card.js`, `app.js`, `README.md` and the whole
   `assets` folder) into the upload box. Click **Commit changes**.
   - `index.html` must be at the top level of the repo, not inside a sub-folder.
4. Go to **Settings → Pages**.
   Under **Build and deployment → Source** choose **Deploy from a branch**,
   branch **main**, folder **/ (root)**, then **Save**.
5. Wait 1–2 minutes and refresh the page. Your live link appears at the top:
   `https://<your-github-username>.github.io/decor-card-maker/`

## Using it

| Field | Notes |
|---|---|
| Name | Always printed in CAPITALS. |
| Education | e.g. `B.Sc (EEE)`. Leave empty to hide the line (designation moves up). |
| Designation | One line per row, max 3 rows. Capital letters print large, small letters print as small capitals — `Assistant Manager` gives the big “A” style of the original card. |
| Phone | Two numbers fit too, e.g. `01711-000000, 01811-000000`. |
| Email | Long emails shrink automatically to fit. |
| More options → Company email | The `info@decor-bd.com` line under the designation. Empty = hidden. |

Long text never overflows: each line shrinks to fit its space.

### Pre-filled links

You can send someone a link that opens with their details already filled:

```
https://<username>.github.io/decor-card-maker/?name=Md.%20Rahim&designation=Site%20Engineer|Solar%20Projects&phone=01700-000000&email=rahim.decor@gmail.com
```

Use `|` to separate designation lines. Fields: `name`, `education`,
`designation`, `phone`, `email`, `companyEmail`.

## Changing the design

- **Fixed artwork** (logo, QR code → https://decor-bd.com/, divider, dots,
  icons, office address) lives in `assets/card-front-template.png`.
  To change the address or QR code, edit that image (keep it 1600 × 914).
- **Text positions, sizes, spacing and colours** are in the `LAYOUT`,
  `COLORS` and `FONTS` blocks at the top of `card.js`.

## Files

```
index.html                     page + form
style.css                      page styling and font loading
card.js                        draws the card on a canvas
app.js                         form handling, preview, PNG download
assets/card-front-template.png blank card background
assets/fonts/                  card fonts (bundled so output is identical everywhere)
assets/favicon.png             browser tab icon
```

## Font licences

Bundled fonts are free/open-licensed: Inter (SIL Open Font License),
Poppins (SIL Open Font License), TeX Gyre Pagella (GUST Font License).
