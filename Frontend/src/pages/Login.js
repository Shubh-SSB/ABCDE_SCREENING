import React, { useState } from "react";
import { API } from "../api";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async () => {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert("Invalid username/password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location.href = "/items";
  };

  const submitSignUp = async () => {
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert("Registration failed");
      return;
    }

    alert("Registration successful! Please login.");
    setIsSignUp(false);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="btn-primary"
          onClick={isSignUp ? submitSignUp : submitLogin}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
        <div className="auth-toggle">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              className="btn-link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setUsername("");
                setPassword("");
              }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
