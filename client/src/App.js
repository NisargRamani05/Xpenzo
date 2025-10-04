// client/src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- IMPORT HERE
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* <-- WRAPPER STARTS HERE */}
        <Navbar />
        <main className="container" style={{marginTop: '2rem'}}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </AuthProvider> {/* <-- WRAPPER ENDS HERE */}
    </Router>
  );
}
export default App;