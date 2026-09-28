# kali.ltd: website hosting record

This repository (`vinowlg/vinowlg.github.io`) hosts the static website for **kali.ltd** on
GitHub Pages. This document records what was built, how the repository was named, and how the
Namecheap domain was connected to it, so the setup can be repeated or changed later.

*Last updated: 27 September 2026*

---

## 1. At a glance

| Item | Value |
|---|---|
| Live site | http://kali.ltd (HTTPS pending, see [§7](#7-current-status-and-open-items)) |
| `www` | http://www.kali.ltd redirects to `kali.ltd` |
| GitHub repository | https://github.com/vinowlg/vinowlg.github.io (public) |
| Pages source | Branch `main`, folder `/ (root)` |
| Custom domain file | `CNAME` in the repo root containing `kali.ltd` |
| Domain registrar / DNS | Namecheap, **Namecheap BasicDNS** |
| Website source (edit here) | `~/code/github/kali` (built and copied into this repo) |
| Local clone of this repo | `~/code/github/vinowlg.github.io` |
| Contact form delivery | FormSubmit → `vino.kali.ltd@gmail.com` |

> **Do not edit files in this repository directly.** They are generated from
> `~/code/github/kali/src` and overwritten on every publish (see [§5](#5-how-to-update-the-site)).
> This `README.md` is the only file the publish step leaves alone.

---

## 2. What was built

A temporary static website for kali.ltd, to be replaced later by a full website.

### Pages (four tabs)

| Tab | File | Content |
|---|---|---|
| Home | `index.html` | Company positioning: a small team, few engagements, metrics-based delivery. Links to both practices. |
| AI Solutions | `ai-solutions.html` | **Kali RAG**, **Kali Agents** (small and medium business partners), **Kali Training** (corporates and universities), and how AI work is measured. |
| Software Automation | `automation.html` | **Kali Suite**, described as a database-driven alternative to traditional BDD and Selenium frameworks. Covers the comparison table, the AI regression-agent workflow, tests-as-data, the scalable runner and CI/CD stage, and the UI and dashboard. |
| Contact | `contact.html` | Contact form that emails `vino.kali.ltd@gmail.com`. |

### Naming conventions

- **kali.ltd** is the company and the domain. It is used in the footer, copyright and page titles.
- **Kali** is the prefix for products:
  - **Kali Suite**: the test automation and regression suite
  - **Kali regression agents**: the AI agents inside Kali Suite
  - **Kali RAG**, **Kali Agents**, **Kali Training**: the AI offerings
- The header uses the **kali**-only logo. The `kali.ltd` logo files are kept in `~/code/github/kali/logos`.

### Design

- The layout is modelled on anthropic.com: warm ivory background, large serif headlines
  (Source Serif 4), Inter for body text, calm cards, and dark full-width sections.
- Colours are taken from the logo files:

  | Name | Hex | Use |
  |---|---|---|
  | Green | `#0B3D2E` | Primary, buttons, dark sections |
  | Maroon | `#7A2036` | Accent, logo nodes, highlights |
  | Silver | `#CDD0D4` | `.ltd`, borders |
  | Ivory | `#FAF9F5` | Page background |

- Custom illustrations:
  - `assets/img/hero-agents.svg`: the home-page hero. An AI agent node connected to documents,
    databases, Jira, CI/CD, a test suite and your team, with an engagement scorecard.
  - `assets/img/kali-suite-dashboard.svg`: a Kali Suite dashboard mockup (its figures are
    illustrative), used on Home and Software Automation.
- Supporting photos are Unsplash images (free licence), loaded from `images.unsplash.com`.
- Tab icon: the logo mark on a **white rounded square** (`favicon.svg`, `favicon.ico`,
  `favicon-32.png`, `apple-touch-icon.png`), so it stays visible on dark browser tabs.
- Responsive down to phone width, with a hamburger menu under 820px.

### Contact form

A static site cannot send email itself, so the form posts to **FormSubmit** (`formsubmit.co`,
free). The endpoint is `https://formsubmit.co/ajax/vino.kali.ltd@gmail.com`.

- The **first** submission on the live site sends a one-time activation email to
  `vino.kali.ltd@gmail.com`. Its link must be clicked before messages are delivered.
- If sending fails, the page shows the email address instead.
- Optional: after activation, FormSubmit provides a random alias. Replacing the email address in
  `kali/src/pages/contact.html` (`action` and `data-endpoint`) with the alias hides the address
  from the page source.

---

## 3. Repository naming (`github.io` → `vinowlg.github.io`)

**Original state:** the repository was named `vinowlg/github.io` and held an older page
(C interview refresher content in `index.html`).

**Why it was renamed:** GitHub only treats a repository named exactly
**`<username>.github.io`** as the account's *user site*, served at `https://<username>.github.io/`.
Any other name, including plain `github.io`, is a *project site* served under a sub-path
(`https://vinowlg.github.io/github.io/`). Both can use a custom domain, but the user site is the
standard, simplest setup.

**Steps taken:**

1. GitHub → repo **Settings → General → Repository name**: renamed `github.io` → `vinowlg.github.io`.
   GitHub automatically redirects the old URL.
2. Local clone updated to match:
   ```bash
   git remote set-url origin https://github.com/vinowlg/vinowlg.github.io.git
   ```
   The local folder was renamed from `~/code/github/github.io` to `~/code/github/vinowlg.github.io`.
3. `~/code/github/kali/scripts/publish.sh` now targets `../vinowlg.github.io` by default.

---

## 4. Connecting the domain

### 4.1 GitHub Pages settings

Repo **Settings → Pages**:

1. **Build and deployment → Source**: *Deploy from a branch*
2. **Branch**: `main`, folder `/ (root)`, then **Save**
3. **Custom domain**: `kali.ltd`, then **Save**. This matches the `CNAME` file in the repo root.
4. `.nojekyll` in the repo root tells Pages to serve the files as-is, without running Jekyll.

### 4.2 Namecheap DNS

Namecheap → **Domain List → kali.ltd → Manage**.

**Nameservers** (Domain tab): **Namecheap BasicDNS**.

**Advanced DNS → Host Records.** First, **the default Namecheap records were deleted**. They
pointed the domain at Namecheap's parking page and would have conflicted with GitHub:

| Type | Host | Value | Action |
|---|---|---|---|
| CNAME Record | `www` | `parkingpage.namecheap.com` | **Deleted** |
| URL Redirect Record | `@` | `http://www.kali.ltd/` | **Deleted** |

**Then these records were added** (TTL: Automatic):

| Type | Host | Value | Purpose |
|---|---|---|---|
| A Record | `@` | `185.199.108.153` | GitHub Pages |
| A Record | `@` | `185.199.109.153` | GitHub Pages |
| A Record | `@` | `185.199.110.153` | GitHub Pages |
| A Record | `@` | `185.199.111.153` | GitHub Pages |
| CNAME Record | `www` | `vinowlg.github.io` | `www.kali.ltd` → GitHub, which redirects to `kali.ltd` |
| TXT Record | `_github-pages-challenge-vinowlg` | *(code from GitHub)* | Domain verification (see §4.3) |

Notes:

- The `www` CNAME points at the **account's** Pages host (`vinowlg.github.io`), not at the repository name.
- The four `A` records are GitHub's published Pages addresses. All four are needed for redundancy.
- Optional IPv6 `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
  `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- Any `MX` or email `TXT` records should be kept if email is used on the domain.

### 4.3 Domain verification

Verification stops anyone else from claiming `kali.ltd` on GitHub Pages.

1. GitHub **account** **Settings → Pages → Add a domain** → `kali.ltd`. (This is account
   settings, not repository settings.)
2. GitHub shows a TXT record. It was added in Namecheap with host
   `_github-pages-challenge-vinowlg` (Namecheap appends `.kali.ltd` itself).
3. Click **Verify** on GitHub.

### 4.4 HTTPS

After DNS resolves, GitHub automatically requests a Let's Encrypt certificate. When it is issued,
tick **Enforce HTTPS** in repo **Settings → Pages**. If the certificate hasn't appeared after about
an hour, click **Remove** under Custom domain, then re-enter `kali.ltd` and **Save**. This restarts
the request.

### 4.5 Checking DNS

```bash
dig kali.ltd +short                                        # four 185.199.10x.153 addresses
dig www.kali.ltd +short                                    # vinowlg.github.io. + the same addresses
dig TXT _github-pages-challenge-vinowlg.kali.ltd +short    # the verification code
```

---

## 5. How to update the site

The site's source lives in **`~/code/github/kali`**:

```
kali/
├── logos/          original brand logo files
├── src/
│   ├── pages/      one file per page (metadata comment + <main> content)
│   ├── partials/   shared <head>, header/nav, footer
│   ├── assets/     css, js, img
│   └── static/     CNAME, .nojekyll, favicon.ico (copied to the site root)
├── scripts/
│   ├── build.py    src/ → dist/ (Python 3, no dependencies)
│   └── publish.sh  build, then mirror dist/ into ../vinowlg.github.io
├── docs/deployment.md
└── README.md
```

To update the site:

```bash
cd ~/code/github/kali
# edit files under src/
python3 scripts/build.py && python3 -m http.server 8000 --directory dist   # preview at http://localhost:8000
scripts/publish.sh                                                         # copy into this repo
cd ~/code/github/vinowlg.github.io
git add -A && git commit -m "Update site" && git push origin main
```

GitHub Pages redeploys within a minute or two of each push.

---

## 6. Pushing: the token problem and its fix

The first push failed with:

```
remote: Permission to vinowlg/github.io.git denied to vinowlg.
fatal: ... The requested URL returned error: 403
```

**Cause:** sign-in worked (as `vinowlg`), but the fine-grained personal access token did not have
**write** access to this repository. Git over HTTPS also rejects the account password, and git
does not read the `GITHUB_TOKEN` environment variable on its own.

**Fix:** GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens →
(token) → Edit**:

- **Repository access**: include `vinowlg.github.io`, or All repositories
- **Permissions → Contents**: **Read and write**

To push using the token in `GITHUB_TOKEN` without saving it to disk:

```bash
git -c credential.helper= \
    -c 'credential.helper=!f() { echo username=vinowlg; echo password=$GITHUB_TOKEN; }; f' \
    push origin main
```

Also recommended:

```bash
git config --global credential.helper osxkeychain     # store credentials in the macOS Keychain, not plain text
git config --global user.name  "Vinoth Sathiyamoorthy"
git config --global user.email "<email on your GitHub account>"
```

---

## 7. Current status and open items

Status as of 27 September 2026:

| Item | Status |
|---|---|
| Repository renamed to `vinowlg.github.io` | ✅ Done |
| Pages enabled (`main`, root), custom domain `kali.ltd` | ✅ Done; Pages status `built` |
| Namecheap parking records removed; GitHub `A` + `www` `CNAME` added | ✅ Done; resolving correctly |
| http://kali.ltd and http://www.kali.ltd | ✅ Live |
| Verification TXT record in Namecheap | ✅ Present in DNS |
| Domain verified on GitHub | ⏳ Shows *unverified*. Click **Verify** in account Settings → Pages. |
| HTTPS certificate / Enforce HTTPS | ⏳ Not yet issued. See §4.4. |
| Latest changes (hero illustration, dashboard mockup, favicon, contact email) | ⏳ Published locally, **not yet committed and pushed** |
| FormSubmit activation | ⏳ Send one test message from the live site, then click the activation link sent to `vino.kali.ltd@gmail.com` |

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| Namecheap parking page appears | A parking CNAME or URL Redirect record is still present, or DNS hasn't updated yet (up to 48 hours, usually under 30 minutes). |
| "Enforce HTTPS" unavailable | The certificate isn't issued yet. Wait, or remove and re-add the custom domain (§4.4). |
| Custom domain cleared after a push | `CNAME` is missing from the repo root. `publish.sh` always includes it. |
| 404 on kali.ltd | Pages is not set to `main` / root, or `index.html` is missing from the root. |
| Push fails with 403 | The token lacks Contents: Read and write on this repo (§6). |
| Old tab icon still shows | Browsers cache favicons. Hard-refresh (Cmd+Shift+R) or open a new tab. |
