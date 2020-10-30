import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "react-bootstrap";

const ViewEvent = (props) => {
  const { modalId, event, showEvent, handleCloseModal, sameDate } = props;
  const getColor = (color) => {
    switch (color) {
      case "eventTag-blue":
        return "#0275d8";
      case "eventTag-red":
        return "#d9534f";
      case "eventTag-yellow":
        return "#f0ad4e";
      case "eventTag-green":
        return "#5cb85c";
      case "eventTag-lightBlue":
        return "#5bc0de";
      default:
        return "#0275d8";
    }
  };

  let formatDate;
  if (sameDate) {
    formatDate = event.allDay ? (
      <>{event.startDate}</>
    ) : (
      <>
        {event.startDate} - {event.endDate}
      </>
    );
  } else {
    formatDate = (
      <>
        from {event.startDate} <br /> to {event.endDate}
      </>
    );
  }

  return (
    <>
      <Modal id={modalId} show={showEvent} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row ">
              <div className="col-1">
                <span
                  className="fa fa-square align-middle"
                  style={{ color: getColor(event.bgColor) }}
                ></span>
              </div>
              <div className="col-11 text-wrap text-left">{formatDate}</div>
            </div>
            <div className="row">
              <div className="col-1">
                <span className="fa fa-address-book"></span>{" "}
              </div>
              <div className="col-11 text-wrap text-left">
                {event.owner.name}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewEvent;
