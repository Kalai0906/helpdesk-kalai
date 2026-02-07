import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    const role = res.data.user.role;

    if (role === "SUPER_ADMIN") navigate("/superadmin");
    else if (role === "ADMIN") navigate("/admin");
    else if (role === "MANAGER") navigate("/manager");
    else if (role === "AGENT") navigate("/agent");
    else if (role === "CUSTOMER") navigate("/customer");
    else navigate("/");

  } catch (err) {
    alert("Login failed");
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>
      
      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p>
        <Link to="/forgot">Forgot Password?</Link>
       </p>
       <p> 
        <Link to="/register">Sign In</Link>
        </p>
    </div>
  );
}
