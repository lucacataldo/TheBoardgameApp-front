import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import React, { useEffect } from "react";

import { format, startOfWeek, parse, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
  const events = [];

  useEffect(() => {}, [events]);

  return (
    <div style={{ height: 700 }} className="col-lg-9 col-xl-10">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
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
