# Xpenzo - Expense Management System 

A comprehensive, role-based expense tracking and approval web application built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**.
The system provides a robust and scalable workflow for **Employees, Managers, and Admins,** automating the entire expense submission and approval lifecycle.  

The application includes advanced features like **multi-currency support, OCR receipt scanning, and multi-level conditional approval flows,** delivering both efficiency and transparency to organizations.


## Overview
Xpenzo empowers companies to:
- **Onboard users** with role-based access (Admin, Manager, Employee).
- **Submit, approve, and manage expenses** with a clear approval workflow.
- **Configure multi-step and conditional approval rules.**
- **Handle expenses across currencies** with automatic conversion.
- **Leverage OCR** for quick receipt scanning and auto-filled expense forms.
- **Provide visibility and analytics** across teams and company structures.

## Features


**Authentication & User Management**
- **JWT-based authentication** with secure signup/login.
- **Auto-company creation**: First signup creates a company in default currency.
- **Admin role**:
  - Create Managers and Employees.
  - Assign manager-employee relationships.
  - Define approval rules and override approvals.
- **Role-based dashboards**: Different UI for Admin, Manager, Employee.

**Expense Submission (Employee)**
- Submit expenses with **amount, currency, category, description, date**.
- Upload receipts → OCR auto-fills details like total, date, and vendor name.
- View submission history with real-time status (Pending, Approved, Rejected).

**Approval Workflow (Manager/Admin)**
- **Multi-level approvals** (e.g., Manager → Finance → Director).
- **Conditional approval rules**:
  - **Percentage rule** (e.g., 60% of approvers must approve).
  - **Specific approver rule** (e.g., CFO auto-approves).
  - **Hybrid rule** (combination of both).
- Managers can review, approve/reject with comments, and view history.

**Advanced Features**
- **Multi-currency support**: Expenses in any currency auto-converted to company default using ExchangeRate-API.
- **Team Directory**:
  - Admins → see full company hierarchy.
  - Managers → see their team members.
- **Profile Page**: Each user can view/update their role-based details.

**UX & Security**
- **Protected routes** → unauthorized users blocked.
- **Error handling** for duplicate emails, company names, invalid inputs.
- **Notifications** with react-hot-toast for actions and updates.
- **Loading indicators** for smooth UX.

##  Installation
### Clone the Repository
   ```
   git clone https://github.com/VandanKambodi/Xpenzo.git
   cd Xpenzo
   ```
### Backend Setup
   ```
   cd server
   npm install
   cp .env   # Fill in MongoDB, JWT, API keys
   npm start
   ```
### Frontend Setup
   ```
   cd client
   npm install
   npm start
   ```
### Set up Environment Variables
Create a file named `.env` in the root directory:
   ```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```
#### Open http://localhost:3000 to view the application.


## Tech Stack
- **Frontend:** React, React Router, Context API, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT
- **APIs:** ExchangeRate-API (currency conversion), RestCountries API, Tesseract.js (OCR)
- **Styling & UX:** TailwindCSS, react-hot-toast


## Project Structure
```bash
Xpenzo/
├── client/                        # React frontend (SPA)
│   ├── src/
│   │   ├── pages/                 # Top-level pages (Login, Dashboard, Profile, Team)
│   │   ├── components/            # Reusable UI components (Navbar, Role dashboards)
│   │   ├── context/               # Global state management (auth, user session)
│   │   ├── App.js                # App entry
│   │   └── index.js              # React DOM entry
│   └── package.json               # Frontend dependencies
│
├── server/                        # Node.js + Express backend
│   ├── models/                    # Mongoose schemas (User, Company, Expense)
│   ├── routes/                    # API routes (auth, expenses, users)
│   ├── controllers/               # Business logic
│   ├── middleware/                # Auth & role-based access control
│   ├── .env                       # Environment variables
│   └── server.js                  # Express app entry
│
└── README.md                      # Documentation

```

## Development Roadmap

- [x] JWT authentication & role-based access
- [x] Admin → create/manage users & approval rules
- [x] Employee → submit expenses with receipts & OCR
- [x] Manager → approve/reject with comments
- [x] Multi-currency expense handling
- [x] Multi-level approval workflows
- [x] Conditional approval rules (percentage/specific approver)
- [x] Profile & team directory pages
- [x] Secure routes & validation handling
- [x] Analytics dashboards
- [ ] Mobile app integration (future roadmap)

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user (first user = Admin).
- `POST /api/auth/login` - Login & receive JWT.
- `GET /api/auth/me` - Get logged-in user details.

### Users & Company
- `POST /api/users` - Admin creates users (Manager/Employee).
- `GET /api/users/:id` - Get user profile.
- `PUT /api/users/:id` - Update user details/role.

### Expenses
- `POST /api/expenses` - Employee submits new expense.
- `GET /api/expenses` - Get all expenses (role-specific).
- `PUT /api/expenses/:id/approve` - Manager/Admin approves.
- `PUT /api/expenses/:id/reject` - Manager/Admin rejects.

### OCR & Currency
- `POST /api/ocr` - Upload receipt → OCR extract fields.
- `GET /api/currency/convert` - Convert expense to company default currency.

## Data Handling

- User, Company, and Expense data stored securely in MongoDB Atlas using Mongoose schemas.
- Expenses managed via secure CRUD APIs with role-based access (Admin, Manager, Employee).
- Currency conversion handled via ExchangeRate-API, ensuring consistent values in the company’s default currency.
- Receipt OCR powered by Tesseract.js, automatically extracting amount, date, and vendor details from uploaded receipts.
- Authentication & sessions managed with JWT tokens, enforcing protected routes and role-based access.


##  Contributing
- Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request
