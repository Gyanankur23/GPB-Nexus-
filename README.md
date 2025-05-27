# GPB Nexus - Career Roadmap & Certification Platform

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Firebase
- **Hosting:** Vercel

---

## 🚀 Step 1: Homepage with Roadmap Listings

Build a React homepage that displays available career roadmaps.

### Example: `RoadmapCard` Component

```jsx
// src/components/RoadmapCard.jsx
const RoadmapCard = ({ title, description, link }) => (
  <div className="roadmap-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <a href={link}>View Roadmap</a>
  </div>
);

export default RoadmapCard;
```

Render a list of these cards in your homepage.

---

## 🚀 Step 2: Secure Quiz Functionality (Backend)

Create backend endpoints for quiz submission, grading, and storing results in Firebase. Prevent cheating with session tracking.

### Example: Express.js Endpoint

```js
// backend/routes/quiz.js
const express = require("express");
const router = express.Router();
const { gradeQuiz, generateCertificate } = require("../utils/quizHelpers");
const { storeQuizResult } = require("../utils/firebaseHelpers");

router.post("/submitQuiz", async (req, res) => {
  const { userId, quizData, sessionId } = req.body;
  // TODO: Add session validation/tracking logic here

  const result = await gradeQuiz(quizData);

  await storeQuizResult(userId, quizData, result);

  if (result.pass) {
    const certificateLink = await generateCertificate(userId, result.score);
    res.json({ success: true, certificate: certificateLink });
  } else {
    res.json({ success: false, feedback: result.feedback });
  }
});

module.exports = router;
```

---

## 🚀 Step 3: Auto-Generate Certification

On quiz success, generate a certification link and store it in Firebase.

```js
// backend/utils/quizHelpers.js
async function generateCertificate(userId, score) {
  const certData = {
    name: await getUserName(userId),
    score,
    date: new Date().toISOString(),
  };
  const certUrl = await uploadCertificateToFirebase(certData);
  return certUrl;
}
```

---

## 🚀 Step 4: Deploy on Vercel

- Push your frontend to Vercel.
- For backend, use Vercel's serverless functions or a separate Node.js host.
- Ensure Firebase credentials and environment variables are set in Vercel dashboard.

---

## Next Steps

- [ ] Style the homepage and roadmap cards.
- [ ] Implement session tracking for quiz security.
- [ ] Add authentication (Firebase Auth recommended).
- [ ] Create achievement/certificate dashboard for users.

---
