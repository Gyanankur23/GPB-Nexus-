import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function RoadmapPage() {
  const router = useRouter();
  const { id } = router.query;
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "roadmaps", id)).then(snap => {
        if (snap.exists()) setRoadmap(snap.data());
      });
    }
  }, [id]);

  if (!roadmap) return <p>Loading roadmap...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{roadmap.title}</h1>
      <p className="mb-4">{roadmap.description}</p>
      <ol className="list-decimal pl-6 space-y-2">
        {roadmap.steps.map((step, idx) => (
          <li key={idx}>
            <span className="font-semibold">{step.title}:</span> {step.description}
          </li>
        ))}
      </ol>
      <Link href={`/quiz/${id}`} className="mt-6 inline-block bg-accent text-white px-6 py-2 rounded hover:opacity-90 font-bold">
        Start {roadmap.title} Certification Exam
      </Link>
    </div>
  );
}
