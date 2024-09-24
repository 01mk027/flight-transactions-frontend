import React, { useState } from 'react';
import Datetime from 'react-bootstrap-datetimepicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

const DateTimePickerComponent = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="container mt-3">
            <Datetime onChange={handleDateChange} value={selectedDate} />
        </div>
    );
};

export default DateTimePickerComponent;
