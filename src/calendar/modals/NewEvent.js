import React, { useState, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";

import { EventContext } from "../../context/EventContext";
const NewEvent = (props) => {
  const { selectedEvent, setSelectedEvent } = useContext(EventContext);

  const [event, setEvent] = useState({
    title: "",
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-blue",
  });
  const { userId } = props;

  const reset = () => {
    setEvent({
      title: "",
      allDay: false,
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      owner: isAuthenticated().user._id,
      bgColor: "eventTag-blue",
    });
  };

  return (
    <>
      <EventForm
        modalId="add-event"
        modalTitle="Add Event"
        eventInfo={event}
        userId={userId}
        resetModal={reset}
      />
    </>
  );
};
export default NewEvent;
