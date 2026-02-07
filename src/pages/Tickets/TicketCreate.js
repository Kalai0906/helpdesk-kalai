import { useState } from "react";
import API from "../../api/axios";
import "./Tickets.css";
import { useNavigate } from "react-router-dom";

export default function TicketCreate() {
  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "LOW",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("description", form.description);
  formData.append("priority", form.priority);
  formData.append("createdBy", localStorage.getItem("user"));
  if (file) formData.append("attachment", file);

  await API.post("/tickets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  navigate("/tickets");
};

  return (
    <div className="ticket-container">
      <h2>Create Ticket</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="subject"
          placeholder="Subject"
          onChange={handleChange}
        /><br /><br />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        /><br /><br />

        <select name="priority" onChange={handleChange}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select><br /><br />
          <input type="file" name="attachment" onChange={handleFileChange} />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
