import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VotingPanel() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/vote/candidates', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      } else {
        setError('Failed to load candidates');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId) => {
    if (!window.confirm("Are you sure? You can only vote once.")) return;
    
    setError('');
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ candidateId })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Vote cast successfully!');
        const updatedUser = { ...user, hasVoted: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); 
      } else {
        setError(data.message || 'Failed to cast vote');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">SecureVote</div>
        <div className="nav-links">
          <span style={{marginRight: '1rem', color: 'var(--text-muted)'}}>Voter: {user.voterId}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="container">
        <h1>Cast Your Vote</h1>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        
        {user.hasVoted ? (
          <div className="glass-card" style={{textAlign: 'center', marginTop: '2rem'}}>
            <h2 style={{color: 'var(--success)'}}>Thank you for voting!</h2>
            <p style={{color: 'var(--text-muted)'}}>Your vote has been securely recorded. You cannot vote again.</p>
          </div>
        ) : (
          <div className="candidate-grid">
            {loading ? <p>Loading candidates...</p> : candidates.map(c => (
              <div key={c._id} className="candidate-card">
                <div>
                  <div className="candidate-name">{c.name}</div>
                  <div className="candidate-party">{c.party}</div>
                </div>
                <button className="btn" onClick={() => castVote(c._id)}>Vote for {c.name}</button>
              </div>
            ))}
            {candidates.length === 0 && !loading && <p>No candidates available.</p>}
          </div>
        )}
      </div>
    </>
  );
}
