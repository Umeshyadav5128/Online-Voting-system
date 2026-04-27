import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        if (data.role === 'admin') navigate('/admin');
        else navigate('/vote');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-container">
      <div className="glass-card">
        <h2>Register to Vote</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Voter ID</label>
            <input 
              type="text" 
              required 
              value={voterId} 
              onChange={(e) => setVoterId(e.target.value)} 
              placeholder="Create your unique Voter ID"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4" style={{color: 'var(--text-muted)'}}>
          Already have an account? <Link to="/login" className="link-text">Login here</Link>
        </p>
      </div>
    </div>
  );
}
