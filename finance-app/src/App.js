import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Budgeting from './components/Budgeting';
import ExpenseTracking from './components/ExpenseTracking';
import SavingsGoals from './components/SavingsGoals';
import Reports from './components/Reports';
import SignUp from './components/SignUp';  
import Login from './components/Login';    
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  console.log(process.env.REACT_APP_BACKEND_URL)
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budgeting" element={<Budgeting />} />
          <Route path="/expense-tracking" element={<ExpenseTracking />} />
          <Route path="/savings-goals" element={<SavingsGoals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sign-up" element={<SignUp />} /> 
          <Route path="/login" element={<Login />} />     
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
