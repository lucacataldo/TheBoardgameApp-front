import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";
//
const NewEvent = (props) => {
  const [event, setEvent] = useState({
    title: "",
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-blue",
    boardgames: [],
    tempBoardgame: "",
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
      boardgames: [],
      tempBoardgame: "",
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
