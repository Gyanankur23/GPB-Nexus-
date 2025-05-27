import { useRouter } from "next/router";
import Quiz from "../../components/Quiz";

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <p>Loading...</p>;
  return <Quiz roadmapId={id} />;
}
