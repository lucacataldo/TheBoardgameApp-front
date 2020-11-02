import React, { useContext } from "react";
import NewEvent from "./modals/NewEvent";
import { isAuthenticated } from "../auth";
import { EventContext } from "../context/EventContext";
import EditEvent from "./modals/EditEvent";
import ViewEvent from "./modals/ViewEvent";
const SideBar = (props) => {
  const { events, setSelectedEvent } = useContext(EventContext);

  return (
    <div className="col-lg-3 col-xl-2">
      {isAuthenticated().user._id === props.userId ? (
        <button
          type="button"
          className="btn btn-primary btn-block"
          data-toggle="modal"
          data-target="#add-event"
        >
          Create Event
        </button>
      ) : (
        ""
      )}
      <div className="m-t-20">
        <br />
        {events.length > 0
          ? events.map((event, index) => (
              <div
                key={event._id}
                className={`external-event ${event.bgColor}`}
                onClick={() => setSelectedEvent(event)}
                data-toggle="modal"
                data-target="#viewEventModal"
              >
                {event.title}
              </div>
            ))
          : "No events added"}
      </div>
      <NewEvent />
      <EditEvent />
      <ViewEvent />
    </div>
  );
};

export default SideBar;
