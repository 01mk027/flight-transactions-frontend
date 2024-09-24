// src/Login.js
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import appfellas from '../appfellaslogo/972882075.png'

const Login = () => {
    const { login, isAuthenticated } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            setError(null);
            navigate('/pickflight');

        } catch (err) {
            setError('Invalid email or password');
        }
    };

    if (isAuthenticated) {
        return <h2>You're already logged in!</h2>;
    }

    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100" id={styles.screen}>
                <div>
                    <img src={appfellas} id={styles.appfellas}/>
                </div>
                <div className='jumbotron bg-warning'>This service is written to book flights, to use service please <b><u>login.</u></b></div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label for="mail">Email address</label>
                        <input
                            id="mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label for="pass">Password</label>
                        <input
                            id="pass"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='form-control'
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                    {error ? <p className='my-2'>{error}</p> : ""}
                </form>
            </div>
        </>
    );
};

export default Login;
