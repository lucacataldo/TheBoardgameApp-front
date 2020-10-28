import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "react-bootstrap";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    formatDate = (
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
  console.log(event.owner);
  return (
    <>
      <Modal id={modalId} show={showEvent} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row align-middle text-center">
              <span
                className="fa fa-square align-middle"
                style={{ color: getColor(event.bgColor) }}
              ></span>
              &nbsp;
              {formatDate}
            </div>
            <div className="row">
              <span className="fa fa-address-book"></span>
              {event.owner.name}
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
