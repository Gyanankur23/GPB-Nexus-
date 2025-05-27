import Link from "next/link";

export default function RoadmapList({ roadmaps }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Roadmaps</h2>
      <ul className="space-y-4">
        {roadmaps.map(rm => (
          <li key={rm.id} className="p-4 rounded shadow bg-white dark:bg-gray-900">
            <h3 className="font-bold text-lg">{rm.title}</h3>
            <p>{rm.description}</p>
            <div className="flex gap-4 mt-2">
              <Link href={`/roadmap/${rm.id}`} className="text-accent underline">View Roadmap</Link>
              <Link href={`/quiz/${rm.id}`} className="text-accent underline">Take {rm.title} Certification Exam</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
