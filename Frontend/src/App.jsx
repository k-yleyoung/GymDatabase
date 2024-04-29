import { useEffect, useState } from "react";

function App() {
  const [members, setMembers] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [memberId, setMemberId] = useState('');
  const [employeeNameToFire, setEmployeeNameToFire] = useState('');
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
  const [newClass, setNewClass] = useState({
    member_id: '',
    class_name:''
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



  const fireEmployee = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8081/employee/delete/${employeeNameToFire}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fire employee');
      }
      return res.json();
    })
    .then(data => {
      console.log(data.message); 
      setEmployeeNameToFire('');
      fetchEmployees(); 
    })
    .catch(err => console.error(err.message));
  };

  const memberPlaceHolders = {
    member_id: "5",
    class_name:"Enter new class name",
    current_class:"Enter current class name"
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
      fetchMembers(); 
    })
    .catch(err => console.log(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
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

  const changeClass = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/class/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClass)
    })
    .then(res => {
      if (!res.ok) { // If the HTTP status code is not successful
        throw new Error('Failed to change class');
      }
      return res.json();
    })
    .then(() => {
      console.log("Class has been changed");
      fetchMembers(); 
    })
    .catch(err => console.log(err.message)); 
  };
  
  const quitClass = (e) => {
    e.preventDefault();
    const dataToSend = {
      member_id: newClass.member_id,
      current_class: newClass.class_name 
    };
  
    fetch('http://localhost:8081/class/quit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to quit class');
      }
      return res.json();
    })
    .then(() => {
      console.log("Successfully quit the class");
      fetchMembers(); // Refresh the list
    })
    .catch(err => console.log(err.message)); 
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
                <td>{d.Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="deleteMemberForm">
        <h2>Cancel Membership</h2>
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
        <h2>Add Member</h2>
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


      <div className="changeClassForm">
        <h2>Change Classes</h2>
        <form onSubmit={changeClass}>
          <label>Enter the member_id and the class you would like to enroll in:</label>
          {Object.keys(newClass).map((key) => (
            <input 
              key={key}
              type="text"
              placeholder={memberPlaceHolders[key]}
              name={key}
              value={newClass[key]}
              onChange={handleClassChange}
              required
            />
          ))}
          <button type="submit">Change Class</button>
        </form>
      </div>
      <div className="quitClassForm">
        <h2>Quit Class</h2>
        <form onSubmit={quitClass}>
          <label>
            Enter the member ID:
            <input 
              type="text"
              placeholder="Member ID"
              name="member_id"
              value={newClass.member_id}
              onChange={handleClassChange}
              required
            />
          </label>
          <label>
            Enter the current class name to quit:
            <input 
              type="text"
              placeholder="Current Class Name"
              name="class_name"
              value={newClass.class_name}
              onChange={handleClassChange}
              required
            />
          </label>
          <button type="submit">Quit Class</button>
        </form>
      </div>

      <div className="fireEmployeeForm">
        <h2>Fire an Employee</h2>
        <form onSubmit={fireEmployee}>
          <label>
            Enter the name of the employee you would like to fire:
            <input 
              type="text"
              value={employeeNameToFire}
              onChange={(e) => setEmployeeNameToFire(e.target.value)}
              required
            />
          </label>
          <button type="submit">Fire Employee</button>
        </form>
      </div>

    </>
  );
}

export default App;
