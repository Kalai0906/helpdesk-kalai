import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Sla.css";

export default function SlaSettings() {
  const [rules, setRules] = useState([]);

  // load rules
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const res = await API.get("/sla");
    setRules(res.data);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rules];
    updated[index][field] = value;
    setRules(updated);
  };

  const saveRule = async (rule) => {
    await API.post("/sla", rule);
    alert("Saved ✅");
    fetchRules();
  };

  return (
    <div className="sla-container">
      <h2>SLA Settings</h2>

      <table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Response (mins)</th>
            <th>Resolution (mins)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rules.map((r, i) => (
            <tr key={r.priority}>
              <td>{r.priority}</td>

              <td>
                <input
                  type="number"
                  value={r.responseTime}
                  onChange={(e) =>
                    handleChange(i, "responseTime", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={r.resolutionTime}
                  onChange={(e) =>
                    handleChange(i, "resolutionTime", e.target.value)
                  }
                />
              </td>

              <td>
                <button onClick={() => saveRule(r)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
