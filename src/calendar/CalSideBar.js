import React from "react";
import AddEvent from "./modals/AddEvent";
const SideBar = () => {
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
        <div className="external-event bg-primary">Game Night</div>
        <div className="external-event bg-secondary">Game Night 1</div>
        <div className="external-event bg-success">Game Night 2</div>
      </div>
      <AddEvent />
    </div>
  );
};

export default SideBar;
