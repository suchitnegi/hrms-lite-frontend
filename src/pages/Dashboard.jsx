import { useState, useEffect } from "react";
import { fetchEmployees, fetchAllAttendance } from "../api";
import Loader from "../components/Loader";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPresent: 0,
    totalAbsent: 0,
    departments: [],
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [emps, records] = await Promise.all([
        fetchEmployees(),
        fetchAllAttendance(),
      ]);

      setEmployees(emps);

      // Calculate stats
      const departments = [...new Set(emps.map((e) => e.department))];
      const presentCount = records.filter((r) => r.status === "Present").length;
      const absentCount = records.filter((r) => r.status === "Absent").length;

      setStats({
        totalEmployees: emps.length,
        totalPresent: presentCount,
        totalAbsent: absentCount,
        departments,
      });

      // Show latest 5 attendance records
      setRecentAttendance(records.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getEmployeeName(empId) {
    const emp = employees.find((e) => e.employee_id === empId);
    return emp ? emp.full_name : empId;
  }

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your HR management system</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{stats.totalEmployees}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Departments</div>
          <div className="stat-value">{stats.departments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Present</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {stats.totalPresent}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Absent</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>
            {stats.totalAbsent}
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="card">
        <h2>Recent Attendance Records</h2>
        {recentAttendance.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <p>No attendance records yet</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((record, idx) => (
                  <tr key={idx}>
                    <td>{getEmployeeName(record.employee_id)}</td>
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

      {/* Employee by Department */}
      {stats.departments.length > 0 && (
        <div className="card">
          <h2>Employees by Department</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employee Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.departments.map((dept) => (
                  <tr key={dept}>
                    <td>{dept}</td>
                    <td>
                      {employees.filter((e) => e.department === dept).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
