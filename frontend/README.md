# GPB Nexus — Frontend

## Setup

1. `cd frontend`
2. `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your Firebase app credentials.
4. Start dev server:
   ```
   npm run dev
   ```

## Firebase Integration

- Uses Firestore for roadmaps & quizzes.
- Uses Auth for Google sign-in and email/password.
- Sample structure for Firestore provided in `/firebase/firestore.sample.json` in the root project.

## Deployment

- **Vercel:** Ready to deploy, no extra config needed.
- **Firebase Hosting:** See `/firebase.json` in the root.

## Design

- Colors: Peach-Light Yellow gradient, #007BFF for accent.
- Smooth dark mode toggle, persists in localStorage.
- Beautiful downloadable PDF certificates with share links.
