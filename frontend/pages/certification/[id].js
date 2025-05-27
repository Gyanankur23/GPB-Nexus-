import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Certificate from "../../components/Certificate";

export default function CertificationPage() {
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

  if (!roadmap) return <p>Loading certificate...</p>;

  return <Certificate roadmapTitle={roadmap.title} />;
}
