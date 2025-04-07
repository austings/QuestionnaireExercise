import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Admin() {
  const [answers, setAnswers] = useState([]);
  // State for expanded questionnaires, e.g., { 3: true, 4: false }
  const [expandedQuestionnaires, setExpandedQuestionnaires] = useState({});
  // State for expanded users per questionnaire, e.g., { 3: { 1: true, 2: false } }
  const [expandedUsers, setExpandedUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }

    const decodedToken = jwtDecode(token);
    // If the user is not an admin, redirect to dashboard
    if (decodedToken.admin !== 1) {
      return navigate('/dashboard');
    }

    fetch('http://localhost:5000/get-answers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnswers(data.answers);
        } else {
          console.error('Failed to fetch answers:', data.message);
        }
      })
      .catch((err) => console.error('Error fetching answers:', err));
  }, [navigate]);

  // Group answers by questionnaire and then by user.
  const groupedAnswers = answers.reduce((acc, answer) => {
    const qId = answer.questionnaire_id;
    const uId = answer.user_id;
    if (!acc[qId]) {
      acc[qId] = {};
    }
    if (!acc[qId][uId]) {
      acc[qId][uId] = [];
    }
    acc[qId][uId].push(answer);
    return acc;
  }, {});

  // Toggle the questionnaire expansion
  const toggleQuestionnaire = (qId) => {
    setExpandedQuestionnaires(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Toggle the user expansion within a specific questionnaire
  const toggleUser = (qId, uId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [uId]: !((prev[qId] && prev[qId][uId]) || false)
      }
    }));
  };

  return (
    <div>
      <button type="button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
      <h2>Admin Panel - Questionnaire Answers</h2>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr style={{ background: '#ccc' }}>
            <th>Level</th>
            <th>ID</th>
            <th>Details</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedAnswers).map(qId => (
            <React.Fragment key={qId}>
              {/* Questionnaire-level row */}
              <tr 
                style={{ background: '#ddd', cursor: 'pointer' }} 
                onClick={() => toggleQuestionnaire(qId)}
              >
                <td>Questionnaire</td>
                <td>{qId}</td>
                <td colSpan="3">
                  {expandedQuestionnaires[qId] ? 'Collapse' : 'Expand'} to view users
                </td>
              </tr>
              {expandedQuestionnaires[qId] && Object.keys(groupedAnswers[qId]).map(uId => (
                <React.Fragment key={uId}>
                  {/* User-level row */}
                  <tr 
                    style={{ background: '#eee', cursor: 'pointer' }} 
                    onClick={() => toggleUser(qId, uId)}
                  >
                    <td style={{ paddingLeft: '20px' }}>User</td>
                    <td>{uId}</td>
                    <td colSpan="3">
                      {expandedUsers[qId] && expandedUsers[qId][uId] ? 'Collapse' : 'Expand'} to view questions and answers
                    </td>
                  </tr>
                  {expandedUsers[qId] && expandedUsers[qId][uId] && groupedAnswers[qId][uId].map(answer => (
                    <tr key={answer.id}>
                      <td style={{ paddingLeft: '40px' }}>Answer</td>
                      <td>{answer.id}</td>
                      <td>{answer.question_id}</td>
                      <td>
                        {(() => {
                          try {
                            const parsed = JSON.parse(answer.name);
                            return parsed.question || answer.name;
                          } catch (e) {
                            return answer.name;
                          }
                        })()}
                      </td>
                      <td>{answer.answer}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
