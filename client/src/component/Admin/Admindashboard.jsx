import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const node_url = import.meta.env.VITE_NODE_URL;


import './admindashboard.css';
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editUser, setEditUser] = useState(null); // For editing user details
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', memberType: '' });
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${node_url}/auth/all-users`);
        if (response.data.status === 'ok') {
          setUsers(response.data.users);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('An error occurred while fetching users');
      }
    };

    fetchUsers();
  }, []);

  // Delete user by ID
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${node_url}/auth/delete-user/${userId}`);
      if (response.data.status === 'ok') {
        setMessage('User deleted successfully.');
        setUsers(users.filter(user => user._id !== userId)); // Remove the deleted user from state
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
      setError('An error occurred while deleting user');
    }
  };

  // Update user details
  const updateUser = async (userId) => {
    try {
      console.log('Updating user:', editUser); // Log user data being sent
      const response = await axios.put(`${node_url}/auth/update-user/${userId}`, editUser);

      console.log('Update response:', response.data); // Log backend response
      if (response.data.status === 'ok') {
        setMessage('User updated successfully.');
        setUsers(users.map(user => (user._id === userId ? response.data.updatedUser : user))); // Update the user in state
        setEditUser(null); // Clear the edit form
      } else {
        setError('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      setError('An error occurred while updating user');
    }
  };

  // Add new user
  const addUser = async () => {
    try {
      const response = await axios.post(`${node_url}/auth/register`, newUser);
      if (response.data.status === 'ok') {
        setMessage('User added successfully.');
        setUsers([...users, response.data.newUser]); // Add new user to the users array
        setNewUser({ username: '', email: '', password: '', memberType: '' }); // Clear form
      } else {
        setError('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('An error occurred while adding user');
    }
  };

  const addrole = async () => {
    navigate('/addrole');
  }
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Display error or success message */}
      {error && <p className="error-msg">{error}</p>}
      {message && <p className="success-msg">{message}</p>}

      {/* Users Table */}
      {!error && users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  {editUser && editUser._id === user._id ? (
                    <input
                      type="text"
                      value={editUser.username}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    />
                  ) : user.username}
                </td>
                <td>
                  {editUser && editUser._id === user._id ? (
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    />
                  ) : user.email}
                </td>
                <td>
                  {editUser && editUser._id === user._id ? (
                    <input
                      type="text"
                      value={editUser.memberType}
                      onChange={(e) => setEditUser({ ...editUser, memberType: e.target.value })}
                    />
                  ) : user.memberType}
                </td>
                <td>
                  {editUser && editUser._id === user._id ? (
                    <>
                      <button className="save-btn" onClick={() => updateUser(user._id)}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditUser(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => setEditUser(user)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteUser(user._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}

      {/* Add New User Form */}
      <div className="add-user-form">
        <h3>Add New User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.memberType}
          onChange={(e) => setNewUser({ ...newUser, memberType: e.target.value })}
        >
          <option value="" disabled>Select Role</option>
          <option value="JuniorEngineer">Junior Engineer</option>
          <option value="AssistantEngineer">Assistant Engineer</option>
          <option value="ExecutiveEngineer">Executive Engineer</option>
          <option value="ChiefEngineer">Chief Engineer</option>
        </select>
        <button onClick={addUser}>Add User</button>
      </div>

      <button className="add-role-btn" onClick={addrole}>Assign Project</button>
    </div>
  );
};

export default AdminDashboard;
