import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Questionnaire() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/questionnaire/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Parse each question JSON
        const parsed = data.map(q => {
          try {
            return JSON.parse(q.question);
          } catch (e) {
            console.error('Invalid question JSON:', q.question);
            return { question: q.question };
          }
        });
        setQuestions(parsed);
      })
      .catch((err) => console.error('Error fetching questions:', err));
  }, [id]);

  return (
    <div>
      <h2>Questions</h2>
      {questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <h4>{q.question}</h4>

          {q.options && (
            <ul>
              {q.options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default Questionnaire;
