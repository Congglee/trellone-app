# 📖 Deploy Trellone App (Frontend) to Render (Static Site)

This guide explains how to deploy the `trellone-app` SPA (Vite + React 18 + TypeScript + Material‑UI) to Render as a Static Site. It mirrors the structure and clarity of the backend deployment guide for consistency.

You will:

- Connect your Git repository
- Create a Static Site service on Render
- Configure the Build Command and Publish Directory
- Enable Auto‑Deploy on Commit
- Add a SPA Redirect/Rewrite rule
- Set the required Vite environment variables (API and OAuth)

---

## 1) Create a Static Site

- Go to Render Dashboard: https://render.com
- New → Static Site
- Connect your Git provider
- Select your repository
- Branch: `main` (recommended for production)

Tip: Ensure your Git account/organization has access to the repository. Select the appropriate Git credentials when Render prompts for authorization.

## 2) Service Configuration

- Type: Static Site
- Name: `trellone-prod-app` (or any name you prefer for production)
- Root Directory: repository root (default)
- Build Command:

```bash
npm ci && npm run build
```

- Publish Directory: `dist`
- Auto‑Deploy: On Commit (Render builds and deploys on every push to `main`)

Notes:

- `npm ci` installs dependencies using the lockfile for reproducible builds.
- `npm run build` runs Vite’s production build and outputs to `dist`.
- Static Site hosts the contents of `dist` via Render’s CDN.

## 3) Environment Variables

The frontend uses Vite env vars (prefixed with `VITE_`) for API and OAuth. In Render → your Static Site → Settings → Environment → Add Environment Variable, add at least:

Minimum required:

- `VITE_APP_API_URL` → Base URL of your backend API (Render service, VPS, or custom domain)
- `VITE_GOOGLE_CLIENT_ID` → Google OAuth Client ID (Web application)
- `VITE_GOOGLE_REDIRECT_URI` → Must point to the backend OAuth endpoint (server exchanges `code` → tokens, then redirects to the frontend)

Example values for Production:

```
VITE_APP_API_URL=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/oauth/google
```

Example values for Staging:

```
VITE_APP_API_URL=https://your-stage-service.onrender.com
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://your-stage-service.onrender.com/auth/oauth/google
```

Optional (only if you use Vite preview on your own VPS):

- `VITE_PREVIEW_ALLOWED_HOSTS` → Comma‑separated list of allowed hostnames (not required for Render Static Site).

Important OAuth notes:

- The frontend callback route is `/login/oauth`. After exchanging the `code`, the backend should redirect to: `https://app.yourdomain.com/login/oauth?access_token=...&refresh_token=...`.
- Therefore, `VITE_GOOGLE_REDIRECT_URI` must point to the backend route: `https://<backend>/auth/oauth/google` (not the frontend route). This matches the server flow.

## 4) Redirect & Rewrite Rule (SPA)

As an SPA, non‑static routes must rewrite to `index.html`. In Render → Static Site → Settings → Redirects/Rewrites → Add Rule:

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

This ensures direct navigation/refresh on routes like `/boards/123` or `/workspaces` always serves the SPA.

## 5) Auto‑Deploy On Commit

- Enable Auto‑Deploy: On Commit so Render automatically builds on new commits to `main`.
- If you need to pause deployments, temporarily switch to manual and trigger deployments on demand.

## 6) First Deployment

- Click Create Static Site
- Render will run `npm ci && npm run build` and publish the `dist` directory
- On success, your site will be available at the Render‑provided domain (or your custom domain if configured)

## 7) Post‑Deployment Checks

1. Open the site and verify the UI loads correctly.
2. Navigate between pages (Boards, Workspaces, etc.).
3. Refresh on a nested route to confirm the SPA rewrite works (no 404).
4. Google login flow:
   - Click the Google button on Login/Register → redirect to Google
   - After consent, verify redirect back to `/login/oauth` and successful sign‑in

If Google login fails:

- Re‑check `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI` (must match Google Console and your backend config exactly)
- In Google Cloud Console, add your domains:
  - Authorized JavaScript origins: your frontend domain
  - Redirect URIs: your backend `/auth/oauth/google` URL

## 8) Notes & Caveats

- The frontend requires a working backend (DB, CORS, JWT…). Ensure `VITE_APP_API_URL` is correct.
- When the backend domain changes, update both `VITE_APP_API_URL` and `VITE_GOOGLE_REDIRECT_URI`.
- If the backend is on Render with MongoDB Atlas, remember to whitelist Render Outbound IPs in Atlas (see the backend deployment guide).
- Custom Domain: you can attach your own domain (Render → Custom Domains) and update OAuth/env settings accordingly.

## 9) Quick Reference (Recommended Production Settings)

- Type: Static Site
- Service name: `trellone-prod-app`
- Repository: Connected Git repository (via your Git provider)
- Branch: `main`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Auto‑Deploy: On Commit
- Redirect/Rewrite Rule: `/*` → `/index.html` (Action: Rewrite)
- Minimum env vars:
  - `VITE_APP_API_URL=https://api.yourdomain.com`
  - `VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com`
  - `VITE_GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/oauth/google`

---

### Troubleshooting

- 404 on internal route refresh: missing SPA rewrite `/* -> /index.html`.
- Blank page after Google login: incorrect `VITE_GOOGLE_CLIENT_ID` or `VITE_GOOGLE_REDIRECT_URI`.
- 401/CORS: check backend CORS settings and verify `VITE_APP_API_URL`.
- Build failures: confirm `package.json` scripts and repository access from Render.
