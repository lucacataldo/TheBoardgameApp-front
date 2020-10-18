import React, { useState, useContext } from "react";
import EventForm from "./EventForm";
import moment from "moment";
import appContext from "../../context/App/appContext";

const AddEvent = () => {
  const [color, setColor] = useState("");
  const [eventname, setEventName] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [showtime, setShowTime] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const calContext = useContext(appContext);
  const { addEvent, events, colors } = calContext;

  const colorObj = {
    primary: "#0275d8",
    success: "#5cb85c",
    info: "#5bc0de",
    warning: "#f0ad4e",
    danger: "#d9534f",
  };

  const inputChange = (event) => {
    setEventName(event.target.value);
  };

  const onCheckBoxChange = (e) => {
    if (e.target.checked === true) {
      setShowTime(true);
      setCheckBox(true);
    } else {
      setShowTime(false);
      setCheckBox(false);
    }
  };

  const onInputChange = (propertyName) => (event) => {
    if (propertyName === "startdate") {
      setStartDate(event);
    }

    if (propertyName === "enddate") {
      setEndDate(event);
    }
  };

  const handleChange = (event) => {
    if (event.target.value !== "Select color") {
      setColor(event.target.value);
    } else {
      setColor("");
    }
  };

  const createEvent = () => {
    const event = setEvent(events.length + 1);
    // add event to events array using context
    addEvent(event);
    reset();
  };

  const setEvent = (id) => {
    const start = `${moment(startDate).format()}`;
    let end = "";
    if (!checkbox) {
      end = `${moment(startDate).format()}`;
    } else {
      end = `${moment(startDate).format("YYYY-MM-DD")}`;
    }

    const event = {
      id,
      title: eventname,
      start,
      end,
      allDay: checkbox,
      bgColor: color,
      backgroundColor: colorObj[color],
    };

    return event;
  };

  const reset = () => {
    setColor("");
    setEventName("");
    setCheckBox(false);
    setShowTime(false);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const closeModal = () => {
    reset();
  };

  return (
    <div>
      <EventForm
        modalId="add-event"
        title="Add Event"
        closeModal={closeModal}
        eventname={eventname}
        inputChange={inputChange}
        checkbox={checkbox}
        onCheckBoxChange={onCheckBoxChange}
        showtime={showtime}
        startDate={startDate}
        endDate={endDate}
        onInputChange={onInputChange}
        color={color}
        colors={colors}
        handleChange={handleChange}
        eventType={createEvent}
        buttonText="Save"
      />
    </div>
  );
};

export default AddEvent;
