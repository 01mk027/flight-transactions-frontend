// src/Flights.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axios.get('http://34.32.36.55/listflights', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFlights(response.data);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        };

        if (token) {
            fetchFlights();
        }
    }, [token]);

    if (!token) {
        return <p>Please log in to view flights.</p>;
    }

    return (
        <div>
            <h2>Available Flights</h2>
            {flights.length > 0 ? (
                <ul>
                    {flights.map(flight => (
                        <li key={flight.id}>
                            {flight.flightName} - {flight.scheduleDate}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No flights available.</p>
            )}
        </div>
    );
};

export default Flights;
