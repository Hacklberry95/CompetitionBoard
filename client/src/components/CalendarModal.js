// src/components/CalendarModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarModal.css";

// Set app element for accessibility
Modal.setAppElement("#root");

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
      className="calendar-modal"
      overlayClassName="calendar-overlay"
    >
      <h2>Select a Date</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
        minDate={new Date(2024, 0, 1)}
        showWeekNumbers={true}
      />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default CalendarModal;
