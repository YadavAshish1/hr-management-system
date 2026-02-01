import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <ToastProvider>
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<EmployeePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </ToastProvider>
  );
}

export default App;
