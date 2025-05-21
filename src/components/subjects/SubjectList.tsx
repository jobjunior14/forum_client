/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import CommentList from "../comments/commentList";
import { SubjectType } from "../types/subject";

export default function SubjectList({
  subjects,
  comments,
  fetchSubjects,
  fetchComments,
}: {
  subjects: any;
  comments: any;
  fetchSubjects: any;
  fetchComments: any;
}) {
  return (
    <div className="space-y-4">
      {subjects.content.map((subject: SubjectType) => (
        <div key={subject.id} className="border p-4 rounded">
          <h3 className="text-lg font-semibold">{subject.title}</h3>
          <p>By: {subject.username}</p>
          <p>{subject.content}</p>
          {subject.imagePath && (
            <img
              src={`http://localhost:8081/uploads/${subject.imagePath}`}
              className="max-w-xs"
            />
          )}
          <Link
            href={`/comments?subjectId=${subject.id}`}
            className="text-blue-600 hover:underline mt-2 block"
          >
            View Comments
          </Link>
          <CommentList
            subjectId={subject.id}
            comments={
              comments[subject.id] || {
                content: [],
                number: 0,
                totalPages: 1,
                size: 10,
              }
            }
            fetchComments={fetchComments}
          />
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
