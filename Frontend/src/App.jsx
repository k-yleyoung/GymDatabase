import { useEffect, useState } from "react";

function App() {
  const [members, setMembers] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [memberId, setMemberId] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    monthly_fee: '',
    start_date: '',
    class_name: '',
  });

  useEffect(() => {
    fetchMembers();
    fetchEmployees();
  }, []);


  const placeholders = {
    name: "Enter full name",
    dob: "DOB: (YYYY-MM-DD)",
    street: "915 Locust St.",
    city: "Enter city",
    state: "Enter state",
    zipcode: "Enter zipcode",
    phone: "Phone - (10 digits)",
    monthly_fee: "Enter monthly fee",
    start_date: "(YYYY-MM-DD)",
    class_name: "Enter class name",
  };

  const fetchMembers = () => {
    fetch('http://localhost:8081/member/get')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.log(err));
  };

  const fetchEmployees = () => {
    fetch('http://localhost:8081/employee/get')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.log(err));
  };

  const deleteMember = (member_id) => {
    fetch(`http://localhost:8081/member/delete/${member_id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      console.log(`Deleted member with ID: ${member_id}`);
      fetchMembers(); // Fetch the updated data after deletion
    })
    .catch(err => console.log(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const addMember = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/member/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMember)
    })
    .then(res => res.json())
    .then(() => {
      console.log("Member added successfully");
      fetchMembers(); // Refresh the list
    })
    .catch(err => console.log(err));
  };

  return (
    <>
      <div className="memberList">
        <h1>Member List</h1>
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Class name</th>
            </tr>
          </thead>
          <tbody>
            {members.map((d, i) => (
              <tr key={i}>
                <td>{d.member_id}</td>
                <td>{d.name}</td>
                <td>{d.age}</td>
                <td>{d.class_name}</td>
                <td>
                  <button onClick={() => deleteMember(d.member_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="EmployeeList">
        <h1>Employee List</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="deleteMemberForm">
        <form onSubmit={(e) => {
          e.preventDefault();
          deleteMember(memberId);
        }}>
          <label>Enter member_id of member you would like to delete:</label>
          <input 
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          />
          <button type="submit">Delete</button>
        </form>
      </div>

      <div className="addMemberForm">
        <form onSubmit={addMember}>
          <label>Enter the following information for the member you are adding:</label>
          {Object.keys(newMember).map((key) => (
            <input 
              key={key}
              type="text"
              placeholder={placeholders[key]}
              name={key}
              value={newMember[key]}
              onChange={handleInputChange}
              required
            />
          ))}
          <button type="submit">Add Member</button>
        </form>
      </div>
    </>
  );
}

export default App;
