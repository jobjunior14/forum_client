import Image from "next/image";
import { SubjectListType, SubjectType } from "../types/subject";

export default function SubjectList({
  subjects,
  fetchSubjects,
}: {
  subjects: SubjectListType;
  fetchSubjects: (page: number) => void;
}) {
  return (
    <div className="space-y-4">
      {subjects.content.map((subject: SubjectType) => (
        <div key={subject.id} className="border p-4 rounded">
          <h3 className="text-lg font-semibold">{subject.title}</h3>
          <p>Par: {subject.username}</p>
          <p>{subject.content}</p>
          {subject.imagePath && (
            <Image
              alt={subject.title}
              src={`http://localhost:8081/uploads/${encodeURIComponent(
                subject.imagePath
              )}`}
              className="max-w-xs"
              width={400}
              height={400}
              unoptimized
            />
          )}
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => fetchSubjects(subjects.number - 1)}
          disabled={subjects.number === 0}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => fetchSubjects(subjects.number + 1)}
          disabled={subjects.number + 1 >= subjects.totalPages}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
