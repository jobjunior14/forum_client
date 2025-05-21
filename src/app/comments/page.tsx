/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CommentList from "../../components/comments/commentList";
import Link from "next/link";

export default function Comments() {
  const router = useRouter();
  const { subjectId } = router.query;
  const [subject, setSubject] = useState<any>(null);
  const [comments, setComments] = useState({
    content: [],
    number: 0,
    totalPages: 1,
    size: 10,
  });
  const [error, setError] = useState("");

  const fetchSubject = async () => {
    if (!subjectId) return;
    try {
      const response = await fetch(
        `http://localhost:8081/api/subjects/${subjectId}`
      );
      const data = await response.json();
      setSubject(data);
    } catch {
      setError("Error loading subject");
    }
  };

  const fetchComments = async (page = 0) => {
    if (!subjectId) return;
    try {
      const response = await fetch(
        `http://localhost:8081/api/comments/${subjectId}?page=${page}&size=10`
      );
      const data = await response.json();
      setComments(data);
    } catch {
      setError("Error loading comments");
    }
  };

  useEffect(() => {
    fetchSubject();
    fetchComments();
  }, [subjectId]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <Link href="/" className="text-xl font-bold">
            Forum App
          </Link>
          <div>
            <Link href="/topics" className="px-4">
              Topics
            </Link>
            <Link href="/subjects" className="px-4">
              Subjects
            </Link>
            {localStorage.getItem("jwt") ? (
              <button
                onClick={() => {
                  localStorage.removeItem("jwt");
                  window.location.href = "/";
                }}
                className="px-4"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="px-4">
                  Login
                </Link>
                <Link href="/register" className="px-4">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {subject ? (
            <>
              <h3 className="text-lg font-semibold">{subject.title}</h3>
              <p className="mb-4">
                Topic: {subject.topicName || "None"} | By: {subject.username}
              </p>
              <CommentList
                subjectId={typeof subjectId === "string" ? subjectId : ""}
                comments={comments}
                fetchComments={fetchComments}
              />
            </>
          ) : (
            <p>Loading subject...</p>
          )}
        </div>
      </main>
    </div>
  );
}
