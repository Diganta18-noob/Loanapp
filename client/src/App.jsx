import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Components/Login';
import Signup from './Components/Signup';
import HomePage from './Components/HomePage';
import ErrorPage from './Components/ErrorPage';
import PrivateRoute from './Components/PrivateRoute';

import LoanForm from './AdminComponents/LoanForm';
import ViewLoans from './AdminComponents/ViewLoans';
import LoanRequest from './AdminComponents/LoanRequest';

import ViewAllLoans from './UserComponents/ViewAllLoans';
import LoanApplicationForm from './UserComponents/LoanApplicationForm';
import AppliedLoans from './UserComponents/AppliedLoans';

import './App.css';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin/loanForm" element={<PrivateRoute requiredRole="admin"><LoanForm /></PrivateRoute>} />
          <Route path="/admin/viewLoans" element={<PrivateRoute requiredRole="admin"><ViewLoans /></PrivateRoute>} />
          <Route path="/admin/loanRequests" element={<PrivateRoute requiredRole="admin"><LoanRequest /></PrivateRoute>} />

          <Route path="/user/viewAllLoans" element={<PrivateRoute requiredRole="user"><ViewAllLoans /></PrivateRoute>} />
          <Route path="/user/applyLoan" element={<PrivateRoute requiredRole="user"><LoanApplicationForm /></PrivateRoute>} />
          <Route path="/user/appliedLoans" element={<PrivateRoute requiredRole="user"><AppliedLoans /></PrivateRoute>} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
