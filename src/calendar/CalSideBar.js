import React, { useContext } from "react";
import AddEvent from "./modals/AddEvent";
import AppContext from "../context/App/appContext";
const SideBar = () => {
  const appContext = useContext(AppContext);
  const { events } = appContext;
  return (
    <div className="col-lg-3 col-xl-2">
      <button
        data-toggle="modal"
        data-target="#add-event"
        className="btn btn-primary btn-block"
      >
        Create New Event
      </button>
      <div className="m-t-20">
        <br />
        {events.length > 0
          ? events.map((event, index) => (
              <div
                className={`external-event bg-${event.bgColor}`}
                key={event.id + index}
                data-toggle="modal"
                data-target="#selection-modal"
              >
                {event.title}
              </div>
            ))
          : "No events added"}
      </div>
      <AddEvent />
    </div>
  );
};

export default SideBar;
