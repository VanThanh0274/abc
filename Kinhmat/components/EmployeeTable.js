export default function EmployeeTable({ employees }) {
    return (
      <table className="w-full border border-gray-200" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  