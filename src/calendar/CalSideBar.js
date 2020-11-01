import React, { useContext } from "react";
import NewEvent from "./modals/NewEvent";
import { isAuthenticated } from "../auth";
import { EventContext } from "../context/EventContext";
import EditEvent from "./modals/EditEvent";
const SideBar = (props) => {
  const { events } = useContext(EventContext);
  return (
    <div className="col-lg-3 col-xl-2">
      {isAuthenticated().user._id === props.userId ? (
        <button
          type="button"
          className="btn btn-primary"
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
              >
                {event.title}
              </div>
            ))
          : "No events added"}
      </div>
      <NewEvent userId={props.userId} />
      <EditEvent />
    </div>
  );
};

export default SideBar;
