import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import styles from "./MyFlights.module.css";
import moment from 'moment';

const MyFlights = () => {
    const { token, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myFlights, setMyFlights] = useState([]);
    const [citiesStart, setCitiesStart] = useState([]);
    const [citiesEnd, setCitiesEnd] = useState([]);

    const fetchMyFlights = () => {
        axios.post('http://localhost:8500/retrievemyflightsviauserid', {
            userId: userId
        }, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            console.log(res);
            setMyFlights(res.data);
        }).catch(err => console.error(err));
    }

    useEffect(() => {

        if (token) {
            fetchMyFlights();
        }
        else {
            navigate('/');
        }
    }, [token]);

    useEffect(() => {
        //item.checkinAllocations && moment(item.checkinAllocations.checkinAllocations[0].endTime).diff(item.checkinAllocations.checkinAllocations[0].startTime, 'minutes')
        //item.checkinAllocations && moment(item.checkinAllocations.checkinAllocations[0].endTime).add(moment(item.checkinAllocations.checkinAllocations[0].endTime).diff(item.checkinAllocations.checkinAllocations[0].startTime, 'minutes'), 'minutes').format('YYYY-MM-DD HH:mm:ss')

        let cc1 = [];
        let cc2 = [];
        myFlights && myFlights.map(item => {

            axios.get(`http://localhost:8500/chooseairline/${item.prefixICAO}`, {
                headers: { Authorization: `Bearer ${token}` },

            }).then(res => {
                //console.log(res.data.iata);
                //res.data.iata

                axios.get(`http://localhost:8500/destinations/${res.data.icao}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then(res => {
                    //citiesPre.push(res.data.city);
                    //console.log(res.data.city);
                    cc1.push(res.data.city);
                    setCitiesStart([...citiesStart, cc1]);
                    axios.get(`http://localhost:8500/destinations/${item.route.destinations[0]}`).then(res => {
                        //console.log(res.data.city);
                        cc2.push(res.data.city);

                        setCitiesEnd([...citiesEnd, cc2]);
                        //setCitiesEnd(cc2);        
                    }).catch(err => console.log(err));

                }).catch(err => console.log(err));

            }).catch(err => console.error(err));


        })


    }, [myFlights]);

    const deleteFlight = async (id) => {
        let resp = window.confirm("Do you want to withdraw this flight request?");
        if (resp) {
            
            await axios.post('http://localhost:8500/deletemyflight', {
                headers: { Authorization: `Bearer ${token}` },
            }, { flightId: id }).then(res => {
                console.log(res);
                fetchMyFlights();
            }).catch(err => console.log(err));
        }

    }

    return (
        <>
            {
                myFlights && myFlights.map((item, index) => {
                    return (
                        <div className='jumbotron-fluid bg-gray' id={styles.flightFrame}>
                            <div>
                                <b className='mx-2 fs-5'>Start: {citiesStart[0] && citiesStart[0][index]} - End: {citiesEnd[0] && citiesEnd[0][index]} (in terms of City)</b>
                            </div>
                            <div className='row'>
                                <div className='col-3'>

                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Airport:</label>
                                        <div>
                                            {item && item.prefixICAO}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Price:</label>
                                        <div>
                                            {item.price && item.price} £
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Departure:</label>
                                        <div>
                                            {item && item.checkinAllocations.length > 0 ? item.checkinAllocations && moment(item.checkinAllocations.checkinAllocations[0].startTime).format('HH:mm:ss') : item && item.scheduleDate + " " +item.scheduleTime}

                                        </div>
                                    </div>
                                </div>

                                <div className='col-3'>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Flight Name:</label>
                                        <div>
                                            {item.flightName && item.flightName}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Flight Number:</label>
                                        <div>
                                            {item.flightNumber && item.flightNumber} 
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Flight Direction:</label>
                                        <div>
                                            {item.flightDirection === 'A' ? "One Way" : "Double Trip"}

                                        </div>
                                    </div>
                                </div>


                                <div className='col-3'>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Arrival Airport:</label>
                                        <div>
                                            {item.route && item.route.destinations.map(item => {
                                                return item
                                            })}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Arrival Date Time:</label>
                                        <div>
                                        {item && item.estimatedLandingTime ? item && moment(item.estimatedLandingTime).format("YYYY-MM-DD HH:mm:ss") : item && moment(item.checkinAllocations.checkinAllocations[0].endTime).format('YYYY-MM-DD HH:mm:ss')}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Created At:</label>
                                        <div>
                                            {item.createdAt && moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}

                                        </div>
                                    </div>
                                </div>

                                <div className='col-3'>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Aircraft Iata Main:</label>
                                        <div>
                                            {item.aircraftType && item.aircraftType.iataMain}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Aircraft Iata Sub:</label>
                                        <div>
                                        {item.aircraftType && item.aircraftType.iataSub}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column my-2 mx-3'>
                                        <label className='fs-5'>Terminal:</label>
                                        <div>
                                            {item.terminal && item.terminal}

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='d-flex flex-row align-items-end'>
                                <button className='btn btn-danger' onClick={() => deleteFlight(item._id)}>WITHDRAW FLIGHT</button>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default MyFlights;