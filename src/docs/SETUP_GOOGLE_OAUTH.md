## Trellone FE – Google OAuth quick setup (Vite)

Below is a concise checklist tailored for this frontend repo. For most local setups you only need a Web Application OAuth Client.

### 1) OAuth Consent Screen

- User type: External (recommended for testing outside Workspace)
- App name, support email, developer contact email
- Scopes: basic profile and email (Google will auto-include)

### 2) Create OAuth Client (Web application)

- Authorized JavaScript origins:
  - `http://localhost:8000`
- Authorized redirect URIs:
  - `http://localhost:8000/auth/oauth/google`

You can add production domains later, for example:

- Origins: `https://app.yourdomain.com`
- Redirect URIs: `https://app.yourdomain.com/auth/oauth/google`

### 3) Configure Vite environment

Create `.env` at the project root:

```env
# API URL
VITE_APP_API_URL='http://localhost:8000'

# Google OAuth
VITE_GOOGLE_CLIENT_ID='YOUR_CLIENT_ID.apps.googleusercontent.com'
VITE_GOOGLE_REDIRECT_URI='http://localhost:8000/auth/oauth/google'

# Preview Mode (optional for Vite preview on VPS)
VITE_PREVIEW_ALLOWED_HOSTS='yourdomain.com,sub.yourdomain.com'
```

Notes:

- The frontend computes OAuth URL from these envs via `src/constants/config.ts` and `src/utils/oauth.ts`.
- Route constant for OAuth callback is `path.oauth = '/auth/oauth/google'`.
- Dev server runs on port 3000 (see `vite.config.ts`). Keep your OAuth origins in sync.

### 4) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then use the Google button on Login/Register.

### 5) Troubleshooting

- Redirect mismatch: ensure Redirect URI matches exactly (scheme, host, path).
- Popup blocked or blank page: check browser console and network; verify `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI`.
- 401 after callback: your backend must exchange `code` → tokens and issue app JWTs; confirm API base URLs and CORS.
