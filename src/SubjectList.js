export default function SubjectList({ subjects, fetchSubjects }) {
  return (
    <div className="space-y-4">
      {subjects.content.map(subject => (
        <div key={subject.id} className="border p-4 rounded">
          <h3 className="text-lg font-semibold">{subject.title}</h3>
          <p>By: {subject.username} | Topic: {subject.topicName || 'None'}</p>
          <p>{subject.content}</p>
          {subject.imagePath && <img src={`http://localhost:8081/Uploads/${subject.imagePath}`} className="max-w-xs" />}
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button onClick={() => fetchSubjects(subjects.number - 1)} disabled={subjects.number === 0} className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">Previous</button>
        <button onClick={() => fetchSubjects(subjects.number + 1)} disabled={subjects.number + 1 >= subjects.totalPages} className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}