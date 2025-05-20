import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validate';
import TopicList from '../components/TopicList';

export default function Topics() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [topics, setTopics] = useState({ content: [], number: 0, totalPages: 1, size: 10 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm({ name }, setError)) return;

    try {
      const response = await fetch('http://localhost:8081/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: `name=${encodeURIComponent(name)}`
      });
      if (response.ok) {
        setSuccess('Topic created');
        setName('');
        fetchTopics();
      } else {
        setError('Failed to create topic');
      }
    } catch {
      setError('Error creating topic');
    }
  };

  const fetchTopics = async (page = 0) => {
    try {
      const response = await fetch(`http://localhost:8081/api/topics?page=${page}&size=10`);
      const data = await response.json();
      setTopics(data);
    } catch {
      setError('Error loading topics');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <a href="/" className="text-xl font-bold">Forum App</a>
          <div>
            <a href="/subjects" className="px-4">Subjects</a>
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
          <h2 className="text-2xl font-bold mb-4">Topics</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          {localStorage.getItem('jwt') && (
            <form onSubmit={handleSubmit} className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Topic Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Topic</button>
            </form>
          )}
          <TopicList topics={topics} fetchTopics={fetchTopics} />
        </div>
      </main>
    </div>
  );
}