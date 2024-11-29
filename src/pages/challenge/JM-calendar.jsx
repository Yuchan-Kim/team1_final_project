import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction"; // for event clicking
import Modal from 'react-modal'; // Modal 컴포넌트를 사용하기 위한 패키지

import '../css/JM-calendar.css';

// 모달 스타일 지정
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Calendar = ({ events, onEventClick }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => handleEventClick(info.event)}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
      />

      {/* 모달 구현 */}
      {selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Mission Details"
        >
          <h2>{selectedEvent.title}</h2>
          <button onClick={closeModal}>Close</button>
          <ul>
            {selectedEvent.extendedProps.missions.map((mission, index) => (
              <li key={index}>{mission}</li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
};

export default Calendar;
