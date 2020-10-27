import React from "react";
import NewEvent from "./modals/NewEvent";
import { isAuthenticated } from "../auth";
const SideBar = (props) => {
  const events = [];

  return (
    <div className="col-lg-3 col-xl-2">
      {isAuthenticated().user._id == props.userId ? (
        <button
          data-toggle="modal"
          data-target="#add-event"
          className="btn btn-primary btn-block"
        >
          Create New Event
        </button>
      ) : (
        ""
      )}
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
      <NewEvent userId={props.userId} />
    </div>
  );
};

export default SideBar;
