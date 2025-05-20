import { useState } from 'react';
import { validateForm } from '../utils/validate';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm({ username, email, password }, setError)) return;

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (response.ok) {
        setSuccess('OTP sent to email');
        setShowOtp(true);
      } else {
        setError('Registration failed');
      }
    } catch {
      setError('Error registering');
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:8081/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      });
      if (response.ok) {
        setSuccess('Email verified');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError('Invalid OTP');
      }
    } catch {
      setError('Verification failed');
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
            <a href="/login" className="px-4">Login</a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        <div className="bg-white p-8 rounded shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          {!showOtp ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Verify OTP</button>
            </form>
          )}
          <p className="mt-4">Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
        </div>
      </main>
    </div>
  );
}