import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/admin/results', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setError('Failed to fetch results');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        alert("Database seeded! Refreshing...");
        fetchResults();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">SecureVote Admin</div>
        <div className="nav-links">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Live Election Results</h1>
          <button className="btn" style={{width: 'auto', background: '#475569'}} onClick={seedDatabase}>Seed Default Candidates</button>
        </div>
        
        {error && <div className="error-msg">{error}</div>}
        
        <div className="glass-card" style={{marginTop: '2rem'}}>
          {loading ? <p>Loading results...</p> : (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate Name</th>
                  <th>Party Affiliation</th>
                  <th>Total Votes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((c, index) => (
                  <tr key={c._id}>
                    <td>#{index + 1}</td>
                    <td style={{fontWeight: '600'}}>{c.name}</td>
                    <td>{c.party}</td>
                    <td>
                      <span style={{
                        background: 'var(--primary)', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                      }}>
                        {c.voteCount}
                      </span>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No results available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
