import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VotingPanel from './pages/VotingPanel';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  const PrivateRoute = ({ children, adminOnly = false }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/vote" />;
    
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/vote" 
          element={
            <PrivateRoute>
              <VotingPanel />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
