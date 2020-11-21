import React, { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";

import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";
import { EventContext } from "../../context/EventContext";

const EditEvent = (props) => {
  const { selectedEvent, setSelectedEvent } = useContext(EventContext);

  const reset = () => {
    setSelectedEvent({
      _id: "",
      title: "",
      allDay: false,
      startDate: new Date(),
      description: "",
      endDate: new Date(),
      owner: isAuthenticated().user._id,
      bgColor: "eventTag-Blue",
      boardgames: [],
    });
  };

  return (
    <>
      <EventForm
        modalId="edit-event"
        modalTitle="Edit Event"
        eventInfo={selectedEvent}
        resetModal={reset}
      />
    </>
  );
};

export default EditEvent;
