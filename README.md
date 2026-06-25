# archivory-mobile

ArchIvory Mobile App

## Local development

```bash
npm install
npm start
```

Run web locally:

```bash
npm run web
```

## GitHub Pages deploy

This repo is configured to deploy Expo web to GitHub Pages from GitHub Actions.

One-time setup in GitHub repo settings:

- Go to **Settings → Pages**
- Set **Source** to **GitHub Actions**

Manual export command (same as CI):

```bash
npm run export:web
```

This command exports to `dist` and patches Expo web asset URLs so they resolve correctly on project Pages paths like `/archivory-mobile/`.

Every push to `main` runs `.github/workflows/deploy-pages.yml` and publishes the generated `dist` folder.

Set `EXPO_PUBLIC_ARCHIVORY_API_URL` to a real submission endpoint to replace the
placeholder upload/result flow.

Set `EXPO_PUBLIC_ARCHIVORY_AUTH_API_URL` to a real auth endpoint (base URL ending
with `/api/auth`) to replace placeholder login and registration flows.

The starter app includes:

- phone camera access with `expo-camera`
- artifact photo capture and retake flow
- account login, registration, and guest access infrastructure
- evidence notes and location/context fields
- image upload placeholder behavior until `API_URL` is configured
- AI result placeholder display
- digital exhibition evidence points placeholder
