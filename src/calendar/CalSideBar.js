import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import NewEvent from "./modals/NewEvent";
import { isAuthenticated } from "../auth";
import { EventContext } from "../context/EventContext";

const SideBar = (props) => {
  const { events } = useContext(EventContext);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <div className="col-lg-3 col-xl-2">
      {isAuthenticated().user._id === props.userId ? (
        <Button className="btn btn-primary btn-block" onClick={handleShowModal}>
          Create Event
        </Button>
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
      <NewEvent
        userId={props.userId}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default SideBar;
