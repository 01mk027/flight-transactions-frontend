import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import styles from './Navbar.module.css';

const NavBar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [brandNavText, setBrandNavText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated){
            setBrandNavText('/pickflight');
        }
        else{
            setBrandNavText('/');
        }
        
    }, [isAuthenticated])

 
    const handleLogout = () => {
        logout();
        navigate('/');  // Redirect to the login page after logout
    };

    const brandTextNavigation = (brandNavText) => {
        console.log("brandNavText => ", brandNavText);
        navigate(brandNavText);
    }

    return (
        <>
        
        <nav id="my-nav" className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to={isAuthenticated ? '/pickflight' : '/'}>
                <FontAwesomeIcon icon={faPlane} id={styles.navBrand}/> 
            </Link>
            <div id={styles.brandText}><span id={styles.brandTextSelf} onClick={() => brandTextNavigation(brandNavText)}>PLANE SCAPE</span></div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="true" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        {isAuthenticated && <Link id={styles.navText} className="nav-link" to={"/pickflight"}>Book Flight</Link>}
                    </li>
                    <li className="nav-item">
                        {isAuthenticated && <Link id={styles.navText} className="nav-link" to="/myflights">My Flights</Link>}
                    </li>
                    <li className="nav-item">
                        {!isAuthenticated ? <Link id={styles.navText} className="nav-link" to="/register">Register</Link> : ""}
                    </li>
                    <li className="nav-item">
                        {isAuthenticated && <Link id={styles.navText} className="nav-link" onClick={() => handleLogout()}>Logout</Link>}
                    </li>
                </ul>
            </div>
        </nav>


        </>
    );
};

export default NavBar;