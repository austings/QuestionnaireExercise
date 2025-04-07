import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        username,
        password
      });
  
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        navigate("/dashboard");
      }
      else {
        setError(res.data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  }
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="username" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <p style={{ color: "red" }}>{error}</p>
    </form>
  );
}
