import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Correct import
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);  // State for admin status
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user token is available
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);  // Decode token to get user data
        setIsAdmin(decoded.admin === 1);  // Check if user is an admin
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    // Fetch questionnaires
    fetch('http://localhost:5000/questionnaires')
      .then((res) => res.json())
      .then((data) => setQuestionnaires(data))
      .catch((err) => console.error('Error fetching questionnaires:', err));
  }, []);

  return (
    <div>
      <button type="button" onClick={() => navigate('/login')}>
        Logout
      </button>
      <div style={{ marginLeft: '20px' }}>
        <h2>Select a Questionnaire</h2>
        {questionnaires.map((q) => (
          <button
            key={q.id}
            onClick={() => navigate(`/questionnaire/${q.id}`)}
            style={{ display: 'block', margin: '8px 0' }}
          >
            {q.name}
          </button>
        ))}

        {/* Show the Admin button only if the user is an admin */}
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            style={{ display: 'block', marginTop: '16px', backgroundColor: 'orange' }}
          >
            Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
