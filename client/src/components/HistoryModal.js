import React from 'react';

// Helper to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const HistoryModal = ({ expense, onClose }) => {
    if (!expense) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Expense History</h2>
                <p className="text-md text-gray-600 mt-1 truncate">{expense.description}</p>
                
                <div className="mt-6 border-l-2 border-gray-200 pl-6 space-y-8">
                    {/* Submission Event */}
                    <div className="relative">
                        <div className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-blue-500"></div>
                        <p className="font-semibold text-gray-700">Expense Submitted</p>
                        <p className="text-sm text-gray-500">By: {expense.submittedBy.name}</p>
                        <time className="text-xs text-gray-400">{formatDate(expense.createdAt)}</time>
                    </div>

                    {/* Approval Path Events */}
                    {expense.approvalPath.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-gray-300"></div>
                            <p className="font-semibold text-gray-700">Review by {step.approver.name}</p>
                            <p className="text-sm">
                                Status: <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white bg-${step.status === 'Approved' ? 'green' : step.status === 'Rejected' ? 'red' : 'yellow'}-500`}>{step.status}</span>
                            </p>
                            {step.actionDate && (
                                <time className="text-xs text-gray-400">{formatDate(step.actionDate)}</time>
                            )}
                            {step.comments && (
                                <p className="mt-2 p-3 bg-gray-50 rounded-md text-sm italic">"{step.comments}"</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;