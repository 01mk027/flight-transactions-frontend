import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Example for using Font Awesome icons
import { faPlaneDeparture, faPlane, faArrows, faPencil } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment/moment';
import styles from './PickFlight.module.css'
import Car from '../images/white-offroader-jeep-parking.jpg';
import Otel from "../images/otel.jpg";
import Travel from "../images/travel.jpg";


const PickFlight = () => {
    const { token, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [tripStartLocation, setTripStartLocation] = useState('');
    const [flightDirection, setFlightDirection] = useState('');
    const [takeOffDate, setTakeOffDate] = useState('');
    const [takeOffTime, setTakeOffTime] = useState('00:00');//tripStartLocation, flightDirection, takeOffDate, takeOffTime 
    const [flightName, setFlightName] = useState('');
    const [airlines, setAirlines] = useState([]);
    const [citiesStart, setCitiesStart] = useState([]);
    const [citiesEnd, setCitiesEnd] = useState([]);
    const [selectedOptionArrivalTime, setSelectedOptionArrivalTime] = useState('');
    const [selectedOptionDepartureTime, setSelectedOptionDepartureTime] = useState('');
    const [prices, setPrices] = useState([]);
    const [priceCriteria, setPriceCriteria] = useState('');


    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axios.get('http://34.32.36.55/fetchairlines', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAirlines(response.data.airlines);
                //console.log(response.data.airlines);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        };

        if (token) {
            fetchFlights();
        }
        else {
            navigate('/');
        }
    }, [token]);





    const fetchFlights = async () => {
        try {
            if (moment(takeOffDate) < moment().subtract(23, 'hours')) {
                alert("You shouldnt choose date which belongs past.");
                return;
            }
            const response = await axios.get('http://34.32.36.55/listflights', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    ////scheduleDate, scheduleTime, flightDirection, airlineCode
                    scheduleDate: moment(takeOffDate).format('YYYY-MM-DD'),
                    scheduleTime: takeOffTime,
                    airlineCode: Number(tripStartLocation),
                    flightDirection: flightDirection,


                }
            });
            setFlights(response.data);
            let pr = [];
            for(let i=0; i<response.data.length; i++)
            {
                pr.push(Math.floor(Math.random() * 1000));
            }
            setPrices(pr);
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    useEffect(() => {
        //item.checkinAllocations && moment(item.checkinAllocations.checkinAllocations[0].endTime).diff(item.checkinAllocations.checkinAllocations[0].startTime, 'minutes')
        //item.checkinAllocations && moment(item.checkinAllocations.checkinAllocations[0].endTime).add(moment(item.checkinAllocations.checkinAllocations[0].endTime).diff(item.checkinAllocations.checkinAllocations[0].startTime, 'minutes'), 'minutes').format('YYYY-MM-DD HH:mm:ss')
        if((citiesStart.length >= 1 && citiesStart[0].length >= flights.length) && (citiesEnd.length >= 1 && citiesEnd[0].length >= flights.length))
        {
            return;
        }
        let cc1 = [];
        let cc2 = [];
        flights && flights.map(item => {
            
            axios.get(`http://34.32.36.55/chooseairline/${item.prefixICAO}`, {
                headers: { Authorization: `Bearer ${token}` },
                
            }).then(res => {
                //console.log(res.data.iata);
                //res.data.iata
                    
                axios.get(`http://34.32.36.55/destinations/${res.data.icao}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then(res => {
                    //citiesPre.push(res.data.city);
                    //console.log(res.data.city);
                    cc1.push(res.data.city);
                    setCitiesStart([...citiesStart, cc1]);
                    axios.get(`http://34.32.36.55/destinations/${item.route.destinations[0]}`).then(res => {
                        //console.log(res.data.city);
                        cc2.push(res.data.city);
                        
                        setCitiesEnd([...citiesEnd, cc2]);
                        //setCitiesEnd(cc2);        
                    }).catch(err => console.log(err));
                    
                }).catch(err => console.log(err));
                
                }).catch(err => console.error(err));
                
                
        })
        
            
    }, [flights])


    useEffect(() => {
        if(priceCriteria === ""){
            return;
        }
        else if(priceCriteria === "up")
        {
            // Get the sorted indices of array1
            const sortedIndices = prices
            .map((value, index) => ({ value, index })) // Map each value to an object with its index
            .sort((a, b) => a.value - b.value) // Sort based on the values of array1
            .map(item => item.index); // Extract sorted indices


            // Sort both arrays using the sorted indices
            const sortedPrices = sortedIndices.map(index => prices[index]);
            const sortedFlights = sortedIndices.map(index => flights[index]);

            setFlights(sortedFlights);
            setPrices(sortedPrices);
        }
        else if(priceCriteria === "down")
        {
            const sortedIndices = prices
            .map((value, index) => ({ value, index })) // Map each value to an object with its index
            .sort((a, b) => b.value - a.value) // Sort based on the values of array1
            .map(item => item.index); // Extract sorted indices


            // Sort both arrays using the sorted indices
            const sortedPrices = sortedIndices.map(index => prices[index]);
            const sortedFlights = sortedIndices.map(index => flights[index]);

            setFlights(sortedFlights);
            setPrices(sortedPrices);
        }
    }, [priceCriteria])


    useEffect(() => {
        //option1 <===> ascending 
        //option2 <===> descending
        if(selectedOptionArrivalTime === "option1")
        {
            let dates = [];
            flights.map(item => {
                if(item.checkinAllocations)
                    dates.push(new Date(moment(item.checkinAllocations.checkinAllocations[0].endTime).format('YYYY-MM-DD HH:mm:ss')).getTime());
                else 
                    dates.push(new Date(moment(item.estimatedLandingTime).format('YYYY-MM-DD HH:mm:ss')).getTime());
            });
            const sortedIndices = dates
            .map((value, index) => ({ value, index })) // Map each value to an object with its index
            .sort((a, b) => a.value - b.value) // Sort based on the values of array1
            .map(item => item.index); // Extract sorted indices

            const sortedPrices = sortedIndices.map(index => prices[index]);
            const sortedFlights = sortedIndices.map(index => flights[index]);          

            setFlights(sortedFlights);
            setPrices(sortedPrices);

        }
        else{
            let dates = [];
            flights.map(item => {
                if(item.checkinAllocations)
                    dates.push(new Date(moment(item.checkinAllocations.checkinAllocations[0].endTime).format('YYYY-MM-DD HH:mm:ss')).getTime());
                else 
                    dates.push(new Date(moment(item.estimatedLandingTime).format('YYYY-MM-DD HH:mm:ss')).getTime());
            });
            const sortedIndices = dates
            .map((value, index) => ({ value, index })) // Map each value to an object with its index
            .sort((a, b) => b.value - a.value) // Sort based on the values of array1
            .map(item => item.index); // Extract sorted indices

            const sortedPrices = sortedIndices.map(index => prices[index]);
            const sortedFlights = sortedIndices.map(index => flights[index]);          

            setFlights(sortedFlights);
            setPrices(sortedPrices);
        }

    }, [selectedOptionArrivalTime]);

    useEffect(() => {
        
        if(selectedOptionDepartureTime === "option11")
        {
            let departureTimes = [];
            flights.map(item => {
            //moment(item.checkinAllocations.checkinAllocations[0].startTime).format('HH:mm:ss')
            if(item.checkinAllocations)
            {
                    departureTimes.push(moment(item.checkinAllocations.checkinAllocations[0].startTime).format('HH:mm:ss'));
            }
            else{
                    departureTimes.push(item.scheduleTime);
            }
            })
            const sortedIndices = departureTimes
                .map((value, index) => ({ value, index }))  // Create an array of objects containing value and index
                .sort((a, b) => {
                    const aHour = parseInt(a.value.split(':')[0], 10); // Extract hour from 'HH:MM:SS'
                    const bHour = parseInt(b.value.split(':')[0], 10);
                    return aHour - bHour; // Sort by hour in ascending order
                })
                .map(item => item.index); 

            const sortedFlights = sortedIndices.map(index => flights[index]);          

            setFlights(sortedFlights);
        }
        else{
            let departureTimes = [];
            flights.map(item => {
            //moment(item.checkinAllocations.checkinAllocations[0].startTime).format('HH:mm:ss')
            if(item.checkinAllocations)
            {
                    departureTimes.push(moment(item.checkinAllocations.checkinAllocations[0].startTime).format('HH:mm:ss'));
            }
            else{
                    departureTimes.push(item.scheduleTime);
            }
            })
            const sortedIndices = departureTimes
            .map((value, index) => ({ value, index }))  // Create an array of objects containing value and index
            .sort((a, b) => {
                const aHour = parseInt(a.value.split(':')[0], 10); // Extract hour from 'HH:MM:SS'
                const bHour = parseInt(b.value.split(':')[0], 10);
                return bHour - aHour; // Sort by hour in ascending order
            })
            .map(item => item.index); 

            const sortedFlights = sortedIndices.map(index => flights[index]);   
            
            setFlights(sortedFlights);

        }
    }, [selectedOptionDepartureTime])

    const bookFlight = async (userId, flightId, price) => {
        let response = window.confirm("Do you want to pick the flight?");

        if(response)
        {
            await axios.post('http://34.32.36.55/pickflight', {
                userId: userId,
                flightId: flightId,
                price: price
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if(res.status === 201){
                    navigate('/myflights');
                }
                }).catch(err => console.log(err));
        }        
    
    }

    return (
        <>
        
            <div className="container w-100">
                <div className="row">
                    <div className="col-9">
                        <div className='container my-2'>

                            <div className='jumbotron-fluid text-center' id={styles.filterFrame}>
                                <h3>SELECTION GROUP FOR LISTING FLIGHTS</h3>
                                <small><b>Don't left blank date!</b></small>
                                <div className="row my-2">
                                    <div className='col-3'>
                                        <div className="input-group">

                                            <span className="input-group-text" id="basic-addon1">
                                                <FontAwesomeIcon icon={faPlaneDeparture} />
                                            </span>


                                            <select value={tripStartLocation} onChange={(e) => setTripStartLocation(e.target.value)} className='form-control'>
                                                <option value="0">Please select airline</option>
                                                {airlines && airlines.map(item => {
                                                    return <option value={item.nvls}>{item.publicName}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-3'>
                                        <div className="input-group">
                                            <span className="input-group-text" id="basic-addon1" style={{ display: 'inline-block' }}>
                                                <FontAwesomeIcon icon={faArrows} />
                                            </span>
                                            <select value={flightDirection} onChange={(e) => setFlightDirection(e.target.value)} className='form-control'>
                                                <option value="">Please select flight direction</option>
                                                <option value="A">A</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-3'>
                                        <DatePicker className="form-control" selected={takeOffDate} onChange={(date) => setTakeOffDate(date)} placeholderText='Select take off date' />

                                    </div>
                                    <div className='col-3'>
                                        <TimePicker onChange={setTakeOffTime} value={takeOffTime} className="form-control" placeholderText="Set takeoff time" />

                                    </div>
                                </div>
                                <button id={styles.showFlightButton} className='btn btn-sm w-50 text-light rounded' onClick={() => fetchFlights()}>Show Flights</button>
                            </div>


                            <div className='row'>
                                <div className='col-9'>
                            {
                                flights && flights.map((item, index) => {
                                    return (
                                        <>
                                            <div className='jumbotron-fluid bg-light my-2' id={styles.flightInfoBox}>
                                                <div>
                                                    <b className='mx-2 fs-5'>{citiesStart[0] && citiesStart[0][index]} - {citiesEnd[0] && citiesEnd[0][index]}</b>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-4'>
                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <label className='fs-5'>Departure:</label>
                                                            <div>
                                                                {item && item.checkinAllocations ? item.checkinAllocations &&  moment(item.checkinAllocations.checkinAllocations[0].startTime).format('HH:mm:ss') : item && item.scheduleTime}
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <label className='fs-5'>Airport:</label>
                                                            <div>
                                                                {item && item.prefixICAO}
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <label className='fs-5'>Price:</label>
                                                            <div>
                                                                {prices[index]} £
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-4'>
                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <div>
                                                                <FontAwesomeIcon icon={faPlane} style={{ width: '50px', height: '50px' }} />
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column my-2 mx-3'>

                                                            <div>
                                                                <p>{item && item.checkinAllocations ? moment(item.checkinAllocations.checkinAllocations[0].endTime).diff(item.checkinAllocations.checkinAllocations[0].startTime, 'minutes') : item && Math.abs(moment(takeOffDate).add(item.scheduleTime.split(':')[0], 'hours').add(item.scheduleTime.split(':')[1], 'minutes').diff(item.estimatedLandingTime, 'minutes'))} minutes</p>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column my-3 mx-3'>
                                                            <div>
                                                                <label className='fs-5'>Flight Name:</label>
                                                                <p>{item.flightName}</p>
                                                            </div>
                                                        </div>                                                        
                                                    </div>
                                                    <div className='col-4'>

                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <label className='fs-5'>Arrival:</label>
                                                            <div>
                                                                {item && item.estimatedLandingTime ? item && moment(item.estimatedLandingTime).format("YYYY-MM-DD HH:mm:ss") : item && moment(item.checkinAllocations.checkinAllocations[0].endTime).format('YYYY-MM-DD HH:mm:ss')}
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <label className='fs-5'>Airport:</label>
                                                            <div>
                                                                {item && item.route && item.route.destinations[0]}
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column my-2 mx-3'>
                                                            <div>
                                                                <button className='btn btn-lg text-light' id={styles.showFlightButton} onClick={() => bookFlight(userId, item.id, prices[index])}>BOOK FLIGHT</button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            </div>
                            <div className='col-3'>{flights.length > 0 ? <>
                                <div className='d-flex flex-column align-items-start justify-content-start p-2' id={styles.filterBox}>
                                        <b className='fs-5'>SORT BY</b>
                                        <div id={styles.sortByItem}>                                    
                                            <label><b>ARRIVAL TIME</b></label>
                                            <div>
                                                <input
                                                type="radio"
                                                id="option1"
                                                name="options"
                                                value="option1"
                                                checked={selectedOptionArrivalTime === 'option1'}
                                                onChange={(e) => setSelectedOptionArrivalTime(e.target.value)}
                                                />
                                                <label htmlFor="option1">Ascending Order</label>
                                            </div>
                                            <div>
                                                <input
                                                type="radio"
                                                id="option2"
                                                name="options"
                                                value="option2"
                                                checked={selectedOptionArrivalTime === 'option2'}
                                                onChange={(e) => setSelectedOptionArrivalTime(e.target.value)}
                                                />
                                                <label htmlFor="option2">Descending Order</label>
                                            </div>
                                        </div>

                                        <div id={styles.sortByItem}>
                                            <label className='my-3 text-center'><b>PRICE AMOUNT</b></label>
                                            <select value={priceCriteria} onChange={(e) => setPriceCriteria(e.target.value)} className='form-control border-warning'>
                                                <option value="">Select price criteria</option>
                                                <option value="up">Lowest to highest</option>
                                                <option value="down">Highest to lowest</option>
                                            </select>
                                        </div>    

                                        <div id={styles.sortByItem}>
                                            <label className='my-3'><b>DEPARTURE TIME</b></label>
                                            <div>
                                                <input
                                                type="radio"
                                                id="option11"
                                                name="options2"
                                                value="option11"
                                                checked={selectedOptionDepartureTime === 'option11'}
                                                onChange={(e) => setSelectedOptionDepartureTime(e.target.value)}
                                                />
                                                <label htmlFor="option1">Ascending Order</label>
                                            </div>
                                            <div>
                                                <input
                                                type="radio"
                                                id="option22"
                                                name="options2"
                                                value="option22"
                                                checked={selectedOptionDepartureTime === 'option22'}
                                                onChange={(e) => setSelectedOptionDepartureTime(e.target.value)}
                                                />
                                                <label htmlFor="option2">Descending Order</label>
                                            </div>
                                        </div>    
                                        
                                    
                                    
                                </div>
                            </> : ""}</div>
                            </div>
                            
                        </div>

                    </div>
                    <div className="col-3">
                        <div className="bg-light p-3">
                            <div id={styles.rightestItem}>
                                <img src={Car} id={styles.rightestItemImage}/>
                            </div>
                            <div id={styles.rightestItem}>
                                <img src={Otel} id={styles.rightestItemImage}/>
                            </div>
                            <div id={styles.rightestItem}>
                                <img src={Travel} id={styles.rightestItemImage}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PickFlight;