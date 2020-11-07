import React, { useState, useContext, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { EventContext } from "../../context/EventContext";
import { isAuthenticated } from "../../auth";

const ViewEvent = (props) => {
  const { selectedEvent } = useContext(EventContext);

  const [event, setEvent] = useState({
    _id: "",
    title: "",
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-Blue",
  });

  useEffect(() => {
    if (selectedEvent.length !== 0) {
      setEvent({
        _id: selectedEvent._id,
        title: selectedEvent.title,
        allDay: selectedEvent.allDay,
        description: selectedEvent.description,
        startDate: new Date(selectedEvent.startDate),
        endDate: new Date(selectedEvent.endDate),
        owner: selectedEvent.owner,
        bgColor: selectedEvent.bgColor,
      });
    }
  }, [selectedEvent]);

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

  const formatingDate = () => {
    let formatDate;
    if (moment(event.startDate).isSame(event.endDate, "day")) {
      formatDate =
        event.allDay ||
        moment(event.startDate).isSame(event.endDate, "minute") ? (
          <> {moment(event.startDate).format("MMM Do YYYY hh:mm A")}</>
        ) : (
          <>
            {moment(event.startDate).format("MMM Do YYYY hh:mm A")} -{" "}
            {moment(event.endDate).format("hh:mm A")}
          </>
        );
    } else {
      formatDate = (
        <>
          From {moment(event.startDate).format("MMM Do YYYY hh:mm A")}
          <br /> To {moment(event.endDate).format("MMM Do YYYY hh:mm A")}
        </>
      );
    }
    return formatDate;
  };

  return (
    <>
      <div
        className="modal fade"
        id="viewEventModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="eventViewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="eventViewModalLabel">
                {event.title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {" "}
              <div className="container-fluid">
                <div className="row ">
                  <div className="col-1">
                    <span
                      className="fa fa-square align-middle"
                      style={{ color: getColor(event.bgColor) }}
                    ></span>
                  </div>
                  <div className="col-11 text-wrap text-left">
                    {formatingDate()}
                  </div>
                </div>
                {event.description ? (
                  <div className="row">
                    <div className="col-1">
                      <span className="fa fa-file"></span>
                    </div>
                    <div className="col-11 text-wrap text-left">
                      {event.description}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="row">
                  <div className="col-1">
                    <span className="fa fa-address-book"></span>
                  </div>
                  <div className="col-11 text-wrap text-left">
                    {event.owner.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                data-dismiss="modal"
                data-toggle="modal"
                data-target="#edit-event"
                className="btn btn-warning"
              >
                Edit Event
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEvent;
