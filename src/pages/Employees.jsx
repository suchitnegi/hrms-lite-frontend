import { useState, useEffect } from "react";
import { fetchEmployees, addEmployee, deleteEmployee } from "../api";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  // Fetch employees on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!form.employee_id || !form.full_name || !form.email || !form.department) {
      setError("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      await addEmployee(form);
      setSuccess("Employee added successfully!");
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(employeeId) {
    if (!window.confirm(`Are you sure you want to delete employee "${employeeId}"?`)) {
      return;
    }

    try {
      setError("");
      await deleteEmployee(employeeId);
      setSuccess(`Employee "${employeeId}" deleted successfully`);
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Employees</h1>
        <p>Manage your organization's employee records</p>
      </div>

      {/* Add Employee Form */}
      <div className="card">
        <h2>Add New Employee</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="employee_id">Employee ID</label>
              <input
                id="employee_id"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                placeholder="e.g. EMP001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. john@company.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Employee Table */}
      <div className="card">
        <h2>All Employees ({employees.length})</h2>

        {loading ? (
          <Loader message="Loading employees..." />
        ) : employees.length === 0 ? (
          <EmptyState icon="👥" message="No employees added yet. Add your first employee above." />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(emp.employee_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
