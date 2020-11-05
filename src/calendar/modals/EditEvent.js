import React, { useState, useContext, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";
import { EventContext } from "../../context/EventContext";
const EditEvent = (props) => {
  const { selectedEvent } = useContext(EventContext);

  const [event, setEvent] = useState({
    _id: "",
    title: "",
    allDay: false,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-Blue",
  });

  useEffect(() => {
    if (selectedEvent.length !== 0) {
      setEvent({
        _id: selectedEvent._id,
        title: selectedEvent.title,
        allDay: selectedEvent.allDay,
        description: selectedEvent.description,
        startDate: new Date(selectedEvent.startDate),
        endDate: new Date(selectedEvent.endDate),
        owner: selectedEvent.owner,
        bgColor: selectedEvent.bgColor,
      });
    }
  }, [selectedEvent]);

  const reset = () => {
    setEvent({
      _id: "",
      title: "",
      allDay: false,
      startDate: new Date(),
      description: "",
      endDate: new Date(),
      owner: isAuthenticated().user._id,
      bgColor: "eventTag-Blue",
    });
  };

  return (
    <>
      <EventForm
        modalId="edit-event"
        modalTitle="Edit Event"
        eventInfo={{
          event,
        }}
        resetModal={reset}
      />
    </>
  );
};
export default EditEvent;
