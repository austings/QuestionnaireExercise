import React, { useState, useEffect } from "react";
import "./App.css";

import { useNavigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/Login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {    
    return (
    <div className="splash-screen">
      <h1>⚔️ Austin's Epic Questionnaire ⚔️</h1>
      <p> Loading the questionnaires..</p>
    </div>
    );
  }

  return null; // or fallback content
}


export default App;
