import React, { useState } from "react";

export default function AuthForm({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const url = `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      if (isLogin) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        setIsLogin(true);
        alert("Registration successful. Please login.");
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <h1 className="display-4 mb-4 text-primary fw-bold">PHISHDETECTOR</h1>

      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-3 text-center">{isLogin ? "Login" : "Register"}</h2>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </small>
          <button
            className="btn btn-link p-0"
            style={{ fontSize: "0.9rem" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
