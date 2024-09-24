// src/App.js
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';  // Correct import
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import NavBar from './components/Navbar';

import PickFlight from './pages/PickFlight';
import MyFlights from './pages/MyFlights';

const App = () => {
  const { isAuthenticated, couldIShow } = useContext(AuthContext);

  useEffect(() => {
    console.log("couldIShow changed:", couldIShow);
  }, [couldIShow]);

  return (
    <AuthProvider>
      <Router>
        {/* Conditionally show NavBar based on couldIShow */}
        <NavBar/>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/pickflight" element={<PickFlight />} />
          <Route path="/myflights" element={<MyFlights />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
