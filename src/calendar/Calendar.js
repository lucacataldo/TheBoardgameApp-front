import React, { useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { EventContext } from "../context/EventContext";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const { events, setSelectedEvent } = useContext(EventContext);

  function Event({ event }) {
    return (
      <div data-toggle="modal" data-target="#viewEventModal">
        {event.title}
      </div>
    );
  }
  const onEventClick = (event) => {
    setSelectedEvent({
      _id: event._id,
      title: event.title,
      allDay: event.allDay,
      description: event.description,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      boardgames: event.boardgames,
      owner: event.owner,
      bgColor: event.bgColor,
    });
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
    </>
  );
};
export default MyCalendar;
