# Google Search Console verification — abdulrehman-qa.vercel.app

Three verification methods are in play for this site. Keep all of them in place —
Google revokes ownership if the token it verified with disappears.

| Method | Value | Where it lives |
| --- | --- | --- |
| HTML meta tag | `sFCobwdgJ47jkotq4vkO_mTo13ORcuoajMbTo7Y_O_A` | `src/app/layout.tsx` → `metadata.verification.google` |
| HTML file upload | `google27246a1b5dd69cd4.html` | `public/google27246a1b5dd69cd4.html` (served at site root) |
| DNS TXT record | `google-site-verification=nyd8rzncZHhhPcSYbeeMHEJP-9VrQacB8McWe9Vvh0k` | Vercel → Project → Settings → Domains (not in this repo) |

## 1. Meta tag (already in the codebase)

Next.js renders it into `<head>` for every route:

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  // ...
  verification: {
    google: "sFCobwdgJ47jkotq4vkO_mTo13ORcuoajMbTo7Y_O_A",
  },
};
```

Output HTML:

```html
<meta name="google-site-verification" content="sFCobwdgJ47jkotq4vkO_mTo13ORcuoajMbTo7Y_O_A" />
```

Verify after deploy:

```bash
curl -s https://abdulrehman-qa.vercel.app | grep -i google-site-verification
```

## 2. HTML file upload (already in the codebase)

Google's "HTML file" method asks for a token file at the root of the site.
Because the app is Next.js, the file lives in `public/` so it is served verbatim:

```
public/google27246a1b5dd69cd4.html
```

Its entire content is the single line Google expects:

```
google-site-verification: google27246a1b5dd69cd4.html
```

The file must be reachable, unmodified, at:

```
https://abdulrehman-qa.vercel.app/google27246a1b5dd69cd4.html
```

Verify after deploy:

```bash
curl -i https://abdulrehman-qa.vercel.app/google27246a1b5dd69cd4.html
# expect: HTTP 200, Content-Type: text/html, body = the token line above
```

Gotchas that break this method:

- Do **not** rename the file or change its content — Google matches the exact
  filename and the exact body string.
- `robots.txt` must not block it. Current rules only disallow `/admin` and
  `/api`, so the root-level file is crawlable.
- No rewrite/redirect may sit in front of it (check `next.config.ts` redirects /
  `middleware.ts` if either is ever added).

## 3. DNS TXT record (must be added in the Vercel dashboard)

A DNS record cannot be committed to a repository — it is created against the
domain in Vercel. This repo only documents the exact values to enter.

Vercel → **abdulrehman-qa** project → **Settings** → **Domains** →
`abdulrehman-qa.vercel.app` → **DNS Records** (or *Add* → *TXT*), then:

| Field | Value |
| --- | --- |
| Type | `TXT` |
| Name / Host | `@`  (empty = the apex of `abdulrehman-qa.vercel.app`) |
| Value / Content | `google-site-verification=nyd8rzncZHhhPcSYbeeMHEJP-9VrQacB8McWe9Vvh0k` |
| TTL | leave default (Vercel does not expose TTL for `*.vercel.app`) |

Notes:

- **Do not** use `_domainconnect` or the Google-supplied `_acme-challenge`-style
  host; Google's TXT method expects the record on the apex of the verified host.
- Vercel's own nameservers manage `*.vercel.app`, so no registrar changes are needed.
- Propagation is usually under a minute on Vercel DNS. Confirm with:

```bash
dig +short TXT abdulrehman-qa.vercel.app
# or
nslookup -type=TXT abdulrehman-qa.vercel.app
```

You should see the `google-site-verification=nyd8rzncZHhhPcSYbeeMHEJP-9VrQacB8McWe9Vvh0k`
string in the answer. Existing Vercel records (A/ALIAS/CNAME for the deployment)
must be left untouched — a TXT record coexists with them.

- Finally, click **Verify** in Google Search Console. Keep both the meta tag and
  the TXT record in place permanently; removing either can revoke ownership.
