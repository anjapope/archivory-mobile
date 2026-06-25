# archivory-mobile

ArchIvory Mobile App

## Local development

```bash
npm install
npm start
```

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
