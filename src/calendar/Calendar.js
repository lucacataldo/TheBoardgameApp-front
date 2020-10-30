import React, { useContext, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  startOfWeek,
  parse,
  getDay,
  parseISO,
  isSameDay,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { EventContext } from "../context/EventContext";
import ViewEvent from "./modals/ViewEvent";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const { events } = useContext(EventContext);
  const [event, setEvent] = useState({
    title: "",
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    owner: "",
    bgColor: "eventTag-Blue",
  });
  const [sameDate, setSameDate] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const handleShowModal = () => setShowEvent(true);
  const handleCloseModal = () => setShowEvent(false);

  const showModal = (event) => {
    event.startDate = format(parseISO(event.startDate), "PPp");

    if (isSameDay(parseISO(event.endDate), parseISO(event.endDate))) {
      event.endDate = format(parseISO(event.endDate), "p");
      setSameDate(true);
    } else {
      event.endDate = format(parseISO(event.endDate), "PPp");
    }
    setEvent(event);
    handleShowModal();
  };

  return (
    <>
      <div style={{ height: 700 }} className="col-lg-9 col-xl-10">
        <Calendar
          selectable
          onSelectEvent={(event) => showModal(event)}
          localizer={localizer}
          events={events}
          startAccessor="startDate"
          endAccessor="endDate"
          eventPropGetter={(event) => ({
            // style: {
            //   backgroundColor: event.backgroundColor,
            // },
            className: "mx-1 " + event.bgColor,
          })}
        />
      </div>
      <ViewEvent
        event={event}
        sameDate={sameDate}
        showEvent={showEvent}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};
export default MyCalendar;
