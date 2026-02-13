import { useState, useEffect } from "react";
import {
  fetchEmployees,
  markAttendance,
  fetchAttendanceByEmployee,
  fetchAllAttendance,
} from "../api";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  // Filters
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      const [emps, records] = await Promise.all([
        fetchEmployees(),
        fetchAllAttendance(),
      ]);
      setEmployees(emps);
      setAttendanceRecords(records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendance() {
    try {
      let records;
      if (filterEmployee) {
        records = await fetchAttendanceByEmployee(filterEmployee);
      } else {
        records = await fetchAllAttendance(filterDate);
      }
      setAttendanceRecords(records);
    } catch (err) {
      setError(err.message);
    }
  }

  // Reload attendance when filters change
  useEffect(() => {
    if (!loading) {
      loadAttendance();
    }
  }, [filterEmployee, filterDate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.employee_id || !form.date || !form.status) {
      setError("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      await markAttendance(form);
      setSuccess("Attendance marked successfully!");
      await loadAttendance();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Find employee name by ID
  function getEmployeeName(empId) {
    const emp = employees.find((e) => e.employee_id === empId);
    return emp ? emp.full_name : empId;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Track and manage daily employee attendance</p>
      </div>

      {/* Mark Attendance Form */}
      <div className="card">
        <h2>Mark Attendance</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="att_employee_id">Employee</label>
              <select
                id="att_employee_id"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="att_date">Date</label>
              <input
                id="att_date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="att_status">Status</label>
              <select
                id="att_status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Marking..." : "Mark Attendance"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="card">
        <h2>Attendance Records</h2>

        {/* Filters */}
        <div className="filter-bar">
          <select
            value={filterEmployee}
            onChange={(e) => {
              setFilterEmployee(e.target.value);
              if (e.target.value) setFilterDate(""); // clear date filter if employee selected
            }}
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.full_name} ({emp.employee_id})
              </option>
            ))}
          </select>

          {!filterEmployee && (
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
            />
          )}
        </div>

        {loading ? (
          <Loader message="Loading attendance records..." />
        ) : attendanceRecords.length === 0 ? (
          <EmptyState icon="📅" message="No attendance records found." />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, idx) => (
                  <tr key={idx}>
                    <td>{getEmployeeName(record.employee_id)}</td>
                    <td>{record.employee_id}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className={`badge badge-${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
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

export default Attendance;
