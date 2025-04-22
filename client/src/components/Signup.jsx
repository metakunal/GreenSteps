import React, { useState } from 'react';
import axios from 'axios';

export default function Signup({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    await axios.post('http://localhost:5000/api/auth/register', { email, password });
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Sign Up</h2>
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded" onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
