import React, { useContext } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, startOfWeek, parse, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { EventContext } from "../context/EventContext";

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

  return (
    <div style={{ height: 700 }} className="col-lg-9 col-xl-10">
      <Calendar
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
  );
};
export default MyCalendar;
