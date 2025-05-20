import { TopicType, TopicListType } from "../types/topic";

export default function TopicList({
  topics,
  fetchTopics,
}: {
  topics: TopicListType;
  fetchTopics: (page: number) => void;
}) {
  const handleUpdate = async (id: string, name: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: `name=${encodeURIComponent(name)}`,
      });
      if (response.ok) fetchTopics(topics.number);
    } catch {
      alert("Error updating topic");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/topics/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      if (response.ok) fetchTopics(topics.number);
    } catch {
      alert("Error deleting topic");
    }
  };

  return (
    <div className="space-y-4">
      {topics.content.map((topic: TopicType) => (
        <div key={topic.id} className="border p-4 rounded">
          <h3 className="text-lg font-semibold">{topic.name}</h3>
          <p>Created by: {topic.username}</p>
          {localStorage.getItem("jwt") && (
            <div className="mt-2">
              <input
                type="text"
                defaultValue={topic.name}
                onBlur={(e) => handleUpdate(topic.id, e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={() => handleDelete(topic.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 ml-2"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => fetchTopics(topics.number - 1)}
          disabled={topics.number === 0}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => fetchTopics(topics.number + 1)}
          disabled={topics.number + 1 >= topics.totalPages}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
