// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://34.32.36.55/register', { name, email, password });
            if(response.status === 201)
            {
                navigate('/');
            }
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    return (
        <div className='d-flex flex-column justify-content-center align-items-center vh-100' id={styles.screen}>
            <div className="jumbotron bg-success">To use service, please <b><u>register.</u></b></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='form-control'
                    />
                </div>
                <button type="submit" className='btn btn-success'>Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
