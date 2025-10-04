import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import '../../pages/AuthForm.css'; // Reuse form styles
import './Dashboard.css'; // Import dashboard styles

const EmployeeDashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Other',
        description: ''
    });
    const [message, setMessage] = useState('');

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses/my-expenses');
            setExpenses(res.data);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    };

    // Fetch expenses when the component first loads
    useEffect(() => {
        fetchExpenses();
    }, []);

    const { amount, category, description } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('/expenses', formData);
            setMessage('Expense submitted successfully!');
            // Clear form and fetch updated expenses
            setFormData({ amount: '', category: 'Other', description: '' });
            fetchExpenses();
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } catch (err) {
            console.error("Error submitting expense:", err.response.data);
            setMessage('Error: Could not submit expense.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div>
            <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Employee Dashboard</h1>

            {/* Section for Submitting a New Expense */}
            <div className="dashboard-section">
                <h2>Submit New Expense</h2>
                <div className="auth-form" style={{maxWidth: '100%', boxShadow: 'none', padding: 0}}>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label>Amount</label>
                            <input type="number" name="amount" value={amount} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={category} onChange={onChange}>
                                <option value="Travel">Travel</option>
                                <option value="Food">Food</option>
                                <option value="Supplies">Office Supplies</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={description} onChange={onChange} required rows="3" style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Submit Expense</button>
                    </form>
                    {message && <p style={{marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
                </div>
            </div>

            {/* Section for Viewing Expense History */}
            <div className="dashboard-section">
                <h2>My Expenses</h2>
                <table className="expenses-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense._id}>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.description}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount}</td>
                                <td>
                                    <span className={`status-badge status-${expense.status}`}>{expense.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeDashboard;