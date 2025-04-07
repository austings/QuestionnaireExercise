import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Correct import
import { useNavigate } from 'react-router-dom';


function Questionnaire() {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]); 
  const navigate = useNavigate();
  
 // Handle MCQ Option Selection
 const handleOptionChange = (event, questionId) => {
    const selectedOption = event.target.value;
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter((answer) => answer.question_id !== questionId);
      updatedAnswers.push({ question_id: questionId, answer: selectedOption });
      return updatedAnswers;
    });
  };

  const handleMultiSelectChange = (event, questionId) => {
    const selectedOption = event.target.value;
    const isChecked = event.target.checked;
  
    setAnswers((prevAnswers) => {
      const existing = prevAnswers.find((a) => a.question_id === questionId);
      let updatedValue = [];
  
      if (existing) {
        const currentOptions = existing.answer.split(', ');
        if (isChecked) {
          updatedValue = [...currentOptions, selectedOption];
        } else {
          updatedValue = currentOptions.filter((opt) => opt !== selectedOption);
        }
      } else if (isChecked) {
        updatedValue = [selectedOption];
      }
  
      const updatedAnswers = prevAnswers.filter((a) => a.question_id !== questionId);
      updatedAnswers.push({
        question_id: questionId,
        answer: updatedValue.join(', '),  // Comma-delimited string
      });
  
      return updatedAnswers;
    });
  };
  
  // Handle Input Field Change
  const handleInputChange = (event, questionId) => {
    const inputValue = event.target.value;
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter((answer) => answer.question_id !== questionId);
      updatedAnswers.push({ question_id: questionId, answer: inputValue });
      return updatedAnswers;
    });
  };

  // Submit Answers to Server
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }

    const decoded = jwtDecode(token);
    
    const response = await fetch('http://localhost:5000/submit-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        user_id: decoded.username,
        questionnaire_id: id,
        answers: answers,
      }),
    });

    if (response.ok) {
      alert('Answers submitted successfully');
      navigate('/dashboard'); // Redirect to dashboard or another page
    } else {
      alert('Error submitting answers');
    }
  };
  useEffect(() => {
    fetch(`http://localhost:5000/questionnaire/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map(q => {
          let questionData;
          try {
            questionData = JSON.parse(q.question);
          } catch (e) {
            console.error('Invalid question JSON:', q.question);
            questionData = { question: q.question };
          }
          return {
            id: q.id,                // Keep question ID
            ...questionData          // Spread parsed question content
          };
        });
        setQuestions(parsed);
      })
      .catch((err) => console.error('Error fetching questions:', err));
  }, [id]);
  
  
return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
      <div style={{ marginLeft: '20px' }}>
        <h2>Questionnaire</h2>
        {questions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
            <h4>{q.question}</h4>

                {/* MCQ Type */}
                {q.type === 'mcq' && q.options && (
                <ul>
                    {q.options.map((opt, i) => (
                    <li key={i}>
                        <label>
                        <input
                            type={q.question.includes('Select all that apply.') ? 'checkbox' : 'radio'}
                            name={`question-${idx}`}
                            value={opt}
                            onChange={(e) =>
                            q.question.includes('Select all that apply.')
                                ? handleMultiSelectChange(e, q.id)
                                : handleOptionChange(e, q.id)
                            }
                        />
                        {opt}
                        </label>
                    </li>
                    ))}
                </ul>
                )}


            {/* Input Type */}
            {q.type === 'input' && (
                <input
                type="text"
                placeholder="Type your answer here"
                onChange={(e) => handleInputChange(e, q.id)} // Handle input answer
                />
            )}
            </div>
        ))}

        <button type="submit">Submit Answers</button>
        </div>
    </form>

  );
}

 
  
export default Questionnaire;
