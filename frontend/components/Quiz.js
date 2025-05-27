import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

export default function Quiz({ roadmapId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(null);
  const [canRetake, setCanRetake] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    async function fetchQuiz() {
      const qRef = doc(collection(db, "quizzes"), roadmapId);
      const snap = await getDoc(qRef);
      if (snap.exists()) {
        setQuiz({
          ...snap.data(),
          questions: shuffle(snap.data().questions).slice(0, 30)
        });
      }
    }
    fetchQuiz();
    // Check last attempt for retake
    if (user) {
      getDoc(doc(db, "quizAttempts", `${roadmapId}_${user.uid}`)).then(snap => {
        if (snap.exists()) {
          const lastTime = snap.data().lastAttempt?.toDate?.() || null;
          if (lastTime) {
            const now = new Date();
            const diff = (now - lastTime) / (1000 * 60 * 60 * 24);
            if (diff < 1) setCanRetake(false);
          }
        }
      });
    }
  }, [roadmapId, user]);

  if (!quiz) return <p>Loading quiz...</p>;
  if (!user) return <p>Please sign in to take the quiz.</p>;
  if (!canRetake) return <p>You can try again tomorrow. Please come back later.</p>;

  const handleAnswer = (idx, ans) => {
    setAnswers({ ...answers, [idx]: ans });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    const percent = (correct / quiz.questions.length) * 100;
    setScore(percent);
    await setDoc(doc(db, "quizAttempts", `${roadmapId}_${user.uid}`), {
      lastAttempt: Timestamp.now(),
      score: percent
    });
    if (percent >= 80) {
      router.push(`/certification/${roadmapId}`);
    }
  };

  if (score !== null) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold">Result</h2>
        <p>Your Score: {score.toFixed(2)}%</p>
        {score < 80 && <p>Sorry, you need at least 80% to pass. Try again tomorrow!</p>}
        {score >= 80 && (
          <p>Congratulations! Redirecting to certificate page...</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {quiz.questions.map((q, i) => (
        <fieldset key={i} className="p-4 bg-white dark:bg-gray-900 rounded shadow mb-4">
          <legend className="font-bold mb-2">{i + 1}. {q.question}</legend>
          <ul className="space-y-2">
            {q.options.map(opt => (
              <li key={opt}>
                <label>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => handleAnswer(i, opt)}
                    required
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
      <button
        type="submit"
        className="w-full bg-accent text-white py-2 rounded font-bold hover:opacity-90"
      >
        Submit
      </button>
    </form>
  );
}
