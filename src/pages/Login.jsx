import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctUsername = "user";
  const correctPassword = "password123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password.");
    } else if (username !== correctUsername || password !== correctPassword) {
      setError("Wrong username or password.");
    } else {
      setError("");
      alert("Login successful!");
      // redirect to home page
      window.location.href = "/home";
    }
  };

  const handleForgotPassword = () => {
    const newPassword = prompt("Enter your new password:");
    if (newPassword) {
      alert(`Password changed to: ${newPassword}`);
      // In real app, send request to backend to change password
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        <button onClick={handleForgotPassword} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
          Forgot Password?
        </button>
      </p>
    </div>
  );
}

