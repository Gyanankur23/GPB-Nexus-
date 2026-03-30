// pages/api/quiz/submit.js
// Kept for compatibility — actual logic is client-side in storage.js

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { answers, questions } = req.body;
  if (!questions || !Array.isArray(questions)) return res.status(400).json({ error: 'Invalid request' });

  let correct = 0;
  questions.forEach((q, i) => {
    if (answers && answers[i] === q.answer) correct++;
  });
  const score = Math.round((correct / questions.length) * 100);
  res.status(200).json({ score, passed: score >= 70, correct, total: questions.length });
}
