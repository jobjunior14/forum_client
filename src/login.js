import { useState } from 'react';
import { validateForm } from '../utils/validate';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm({ username, password }, setError)) return;

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('jwt', token);
        router.push('/');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <a href="/" className="text-xl font-bold">Forum App</a>
          <div>
            <a href="/topics" className="px-4">Topics</a>
            <a href="/subjects" className="px-4">Subjects</a>
            <a href="/register" className="px-4">Register</a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        <div className="bg-white p-8 rounded shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button>
          </form>
          <p className="mt-4">Don't have an account? <a href="/register" className="text-blue-600">Register</a></p>
        </div>
      </main>
    </div>
  );
}