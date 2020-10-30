import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";

const NewEvent = (props) => {
  const [event, setEvent] = useState({
    title: "",
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-Blue",
  });
  const { userId, showModal, handleCloseModal } = props;

  const reset = () => {
    setEvent({
      title: "",
      allDay: false,
      startDate: new Date(),
      endDate: new Date(),
      owner: isAuthenticated().user._id,
      bgColor: "eventTag-Blue",
    });
  };

  return (
    <>
      <EventForm
        modalId="add-event"
        modalTitle="Add Event"
        eventInfo={{
          event,
        }}
        userId={userId}
        resetModal={reset}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};
export default NewEvent;
