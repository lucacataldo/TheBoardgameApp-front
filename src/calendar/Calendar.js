import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import React, { useState, useContext } from "react";
import AppContext from "../context/App/appContext";
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
  const calContext = useContext(AppContext);
  const { addEvent, events, colors } = calContext;
  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};
export default MyCalendar;
