import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { EventContext } from "../context/EventContext";
import ViewEvent from "./modals/ViewEvent";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const { events, setSelectedEvent } = useContext(EventContext);
  const [event, setEvent] = useState({
    title: "",
    allDay: false,
    startDate: "",
    endDate: "",
    owner: "",
    bgColor: "eventTag-Blue",
  });

  function Event({ event }) {
    return (
      <div data-toggle="modal" data-target="#viewEventModal">
        <strong>{event.title}</strong>
      </div>
    );
  }
  const onEventClick = (event) => {
    setEvent(event);
    setSelectedEvent(event);
  };

  return (
    <>
      <div style={{ height: 700 }} className="col-lg-9 col-xl-10">
        <Calendar
          selectable
          onSelectEvent={(event) => onEventClick(event)}
          localizer={localizer}
          events={events}
          startAccessor="startDate"
          endAccessor="endDate"
          eventPropGetter={(event) => ({
            className: "mx-1 " + event.bgColor,
          })}
          components={{
            event: Event,
          }}
        />
      </div>
      <ViewEvent event={event} modalId="viewEventModal" />
    </>
  );
};
export default MyCalendar;
