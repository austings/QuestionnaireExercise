import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/questionnaires')
      .then((res) => res.json())
      .then((data) => setQuestionnaires(data))
      .catch((err) => console.error('Error fetching questionnaires:', err));
  }, []);

  return (
    <div>
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
    </div>
  );
}

export default Dashboard;
