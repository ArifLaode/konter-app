import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Pulsa from './Pulsa';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/pulsa" element={token ? <Pulsa /> : <Navigate to="/login" />} />
                <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
