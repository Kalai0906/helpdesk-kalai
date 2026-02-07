import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMsg("Reset link sent to your email (demo message)");
    } catch {
      setMsg("Error sending reset link");
    }
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ForgotPassword;
