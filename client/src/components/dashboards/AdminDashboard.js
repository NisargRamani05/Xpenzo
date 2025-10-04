import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import '../../pages/AuthForm.css'; // We can reuse the form styling

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee',
        manager: ''
    });
    const [managers, setManagers] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch the list of managers when the component loads
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await api.get('/users/managers');
                setManagers(res.data);
            } catch (err) {
                console.error("Error fetching managers:", err);
            }
        };
        fetchManagers();
    }, []);

    const { name, email, password, role, manager } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Remove manager field if role is not Employee
            const submissionData = role !== 'Employee' ? { ...formData, manager: undefined } : formData;

            await api.post('/users', submissionData);
            setMessage(`Successfully created ${role}: ${name}`);
            // Clear form
            setFormData({ name: '', email: '', password: '', role: 'Employee', manager: '' });
            // Optional: refresh manager list if a new manager was created
            if (role === 'Manager') {
                const res = await api.get('/users/managers');
                setManagers(res.data);
            }
        } catch (err) {
            console.error("Error creating user:", err.response.data);
            setMessage(`Error: ${err.response.data.msg || 'Could not create user'}`);
        }
    };

    return (
        <div>
            <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Admin Dashboard</h1>
            <div className="auth-form" style={{maxWidth: '600px'}}>
                <h2>Create New User</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={role} onChange={onChange}>
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                    {role === 'Employee' && (
                        <div className="form-group">
                            <label>Assign Manager</label>
                            <select name="manager" value={manager} onChange={onChange} required>
                                <option value="" disabled>Select a manager</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button type="submit" className="submit-btn">Create User</button>
                </form>
                {message && <p style={{marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;