"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { validateForm } from "../../components/utlis/validate";

export default function CommentList({
  subjectId,
  comments,
  fetchComments,
}: {
  subjectId: number | string;
  comments: any;
  fetchComments: (page: number) => void;
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm({ content }, setError)) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("subjectId", String(subjectId));
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8081/api/comments", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        body: formData,
      });
      if (response.ok) {
        setSuccess("Comment created");
        setContent("");
        setImage(null);
        fetchComments(Number(subjectId));
      } else {
        setError("Failed to create comment");
      }
    } catch {
      setError("Error creating comment");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!validateForm({ content: editContent }, setError)) return;

    const formData = new FormData();
    formData.append("content", editContent);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`http://localhost:8081/api/comments/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        body: formData,
      });
      if (response.ok) {
        setSuccess("Comment updated");
        setEditCommentId(null);
        setEditContent("");
        setImage(null);
        fetchComments(Number(subjectId));
      } else {
        setError("Failed to update comment");
      }
    } catch {
      setError("Error updating comment");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      if (response.ok) {
        setSuccess("Comment deleted");
        fetchComments(Number(subjectId));
      } else {
        setError("Failed to delete comment");
      }
    } catch {
      setError("Error deleting comment");
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold mb-2">Comments</h4>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {localStorage.getItem("jwt") && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Image</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  setImage(e.target.files[0]);
              }}
              className="p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Comment
          </button>
        </form>
      )}
      {comments.content.map((comment: any) => (
        <div key={comment.id} className="border-l-2 pl-4 mb-2">
          {editCommentId === comment.id ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded"
                required
              ></textarea>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    setImage(e.target.files[0]);
                }}
                className="p-2"
              />
              <button
                onClick={() => handleUpdate(comment.id)}
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditCommentId(null)}
                className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p>{comment.content}</p>
              <p className="text-sm">
                By: {comment.username} |{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              {comment.imagePath && (
                <img
                  src={`http://localhost:8081/uploads/${comment.imagePath}`}
                  className="max-w-xs"
                />
              )}
              {localStorage.getItem("jwt") &&
                comment.userId ===
                  parseInt(localStorage.getItem("userId") || "0") && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setEditCommentId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => fetchComments(comments.number - 1)}
          disabled={comments.number === 0}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => fetchComments(comments.number + 1)}
          disabled={comments.number + 1 >= comments.totalPages}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
