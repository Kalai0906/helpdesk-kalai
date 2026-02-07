import { useState } from "react";
import API from "../../api/axios";
import "./Users.css";

export default function UserCreate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "AGENT",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/users", form);
    alert("User created");
  };

  return (
    <div className="users-container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <select name="role" onChange={handleChange}>
          <option value="AGENT">Agent</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
