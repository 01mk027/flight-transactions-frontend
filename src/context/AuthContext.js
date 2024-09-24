// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();  // Creating the context

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);


    useEffect(() => {
        if (token) {
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userId', userId);
            
        } else {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userId');
        }
    }, [token, userId]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://34.32.36.55/login', { email, password });
            setToken(response.data.token);
            setUserId(response.data.userId);
            return response.data;
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated, userId }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export both AuthProvider and AuthContext
export { AuthContext };
export default AuthContext;
