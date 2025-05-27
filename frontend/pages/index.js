import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import RoadmapList from "../components/RoadmapList";
import { auth } from "../lib/firebase";
import Link from "next/link";

export default function Home() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getDocs(collection(db, "roadmaps")).then(snapshot => {
      setRoadmaps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  return (
    <div>
      {!user && (
        <div className="mb-4 text-center">
          <Link href="/login" className="bg-accent text-white px-4 py-2 rounded">Sign In to Start</Link>
        </div>
      )}
      <RoadmapList roadmaps={roadmaps} />
    </div>
  );
}
