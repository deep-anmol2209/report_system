const UserSelector = ({ users, selectedUser, onChange }) => {
    console.log(users);
    
    return (
      <select
        className="form-control"
        value={selectedUser}
        onChange={onChange}
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.firstName} ({user.email})
          </option>
        ))}
      </select>
    );
  };
  
  export default UserSelector;