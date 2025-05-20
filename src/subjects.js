import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validate';
import SubjectList from '../components/SubjectList';

export default function Subjects() {
  const [query, setQuery] = useState('all');
  const [topicId, setTopicId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState({ content: [], number: 0, totalPages: 1, size: 10 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/topics?page=0&size=100');
      const data = await response.json();
      setTopics(data.content);
    } catch {
      setError('Error loading topics');
    }
  };

  const fetchSubjects = async (page = 0) => {
    try {
      const url = `http://localhost:8081/api/subjects?query=${encodeURIComponent(query)}&topicId=${topicId}&page=${page}&size=10`;
      const response = await fetch(url);
      const data = await response.json();
      setSubjects(data);
    } catch {
      setError('Error loading subjects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm({ title, content }, setError)) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (topicId) formData.append('topicId', topicId);
    if (image) formData.append('image', image);

    try {
      const response = await fetch('http://localhost:8081/api/subjects', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
        body: formData
      });
      if (response.ok) {
        setSuccess('Subject created');
        setTitle('');
        setContent('');
        setTopicId('');
        setImage(null);
        fetchSubjects();
      } else {
        setError('Failed to create subject');
      }
    } catch {
      setError('Error creating subject');
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
  }, [query, topicId]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <a href="/" className="text-xl font-bold">Forum App</a>
          <div>
            <a href="/topics" className="px-4">Topics</a>
            {localStorage.getItem('jwt') ? (
              <button onClick={() => { localStorage.removeItem('jwt'); window.location.href = '/'; }} className="px-4">Logout</button>
            ) : (
              <>
                <a href="/login" className="px-4">Login</a>
                <a href="/register" className="px-4">Register</a>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Subjects</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          <form onSubmit={(e) => { e.preventDefault(); fetchSubjects(); }} className="mb-4">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subjects" className="p-2 border rounded" required />
            <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="p-2 border rounded">
              <option value="">All Topics</option>
              {topics.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
          </form>
          {localStorage.getItem('jwt') && (
            <form onSubmit={handleSubmit} className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Topic</label>
                <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="p-2 border rounded">
                  <option value="">No Topic</option>
                  {topics.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Image</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className="p-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Subject</button>
            </form>
          )}
          <SubjectList subjects={subjects} fetchSubjects={fetchSubjects} />
        </div>
      </main>
    </div>
  );
}