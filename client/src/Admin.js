import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Admin() {
  const [answers, setAnswers] = useState([]);
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
        method: 'GET', // Change to GET for data retrieval
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAnswers(data.answers); // Set the answers to state
          } else {
            console.error('Failed to fetch answers:', data.message);
          }
        })
        .catch((err) => console.error('Error fetching answers:', err));
    }, [navigate]);

  return (
    
    <div>
      <button type="button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
      <h2>Admin Panel - Questionnaire Answers</h2>
      <table>
        <thead>
          <tr>
            <th>Answer ID</th>
            <th>User ID</th>
            <th>Questionnaire</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer) => (
            
            <tr key={answer.id}>
              <td>{answer.id}</td>
              <td>{answer.user_id}</td>
              <td>{answer.questionnaire_id}</td>
              <td>
                {(() => {
                    try {
                    const parsed = JSON.parse(answer.name);
                    return parsed.question || answer.name;  // fetch question name from id
                    } catch (e) {
                    return answer.name; // fallback if not JSON
                    }
                })()}
                </td>
              <td>{answer.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
