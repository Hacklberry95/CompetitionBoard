// src/components/CalendarModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarModal.css";

// Set app element for accessibility
Modal.setAppElement("#root"); // Make sure this matches your main app element

const CalendarModal = ({ isOpen, onRequestClose }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    console.log("Selected date:", newDate); // Log the selected date
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Calendar"
      className="calendar-modal" // Add custom class for styling
      overlayClassName="calendar-overlay" // Add overlay class for styling
    >
      <h2>Select a Date</h2>
      <Calendar onChange={handleDateChange} value={date} />
      <div className="selected-date">
        <h3>Selected Date: {date.toDateString()}</h3>
      </div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default CalendarModal;
