import React from "react";

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const HistoryModal = ({ expense, onClose }) => {
  if (!expense) return null;

  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-emerald-500";
    if (status === "Rejected") return "bg-red-500";
    return "bg-amber-500"; // pending or others
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFFD4] rounded-lg shadow-xl w-full max-w-2xl p-6 relative border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#073737] text-3xl font-bold"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#073737]">Expense History</h2>
        <p className="text-md text-gray-700 mt-1 truncate">
          {expense.description}
        </p>

        {/* Timeline */}
        <div className="mt-6 border-l-2 border-gray-300 pl-6 space-y-8">
          {/* Submission Event */}
          <div className="relative">
            <div className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-blue-600"></div>
            <p className="font-semibold text-[#073737]">Expense Submitted</p>
            <p className="text-sm text-gray-600">
              By: {expense.submittedBy.name}
            </p>
            <time className="text-xs text-gray-500">
              {formatDate(expense.createdAt)}
            </time>
          </div>

          {/* Approval Path Events */}
          {expense.approvalPath.map((step, index) => (
            <div key={index} className="relative">
              <div
                className={`absolute -left-7 top-1 h-3 w-3 rounded-full ${getStatusColor(
                  step.status
                )}`}
              ></div>
              <p className="font-semibold text-[#073737]">
                Review by {step.approver.name}
              </p>
              <p className="text-sm text-gray-700">
                Status:{" "}
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${
                    getStatusColor(step.status)
                  }`}
                >
                  {step.status}
                </span>
              </p>
              {step.actionDate && (
                <time className="text-xs text-gray-500">
                  {formatDate(step.actionDate)}
                </time>
              )}
              {step.comments && (
                <p className="mt-2 p-3 bg-white rounded-md border border-gray-200 text-sm italic text-gray-700">
                  "{step.comments}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
