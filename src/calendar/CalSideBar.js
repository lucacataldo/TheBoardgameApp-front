import React, { useContext } from "react";
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
    </div>
  );
};

export default SideBar;
