import React, { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { EventContext } from "../../context/EventContext";

const ViewEvent = (props) => {
  const { selectedEvent } = useContext(EventContext);

  const formatingDate = () => {
    let formatDate;
    if (moment(selectedEvent.startDate).isSame(selectedEvent.endDate, "day")) {
      formatDate =
        selectedEvent.allDay ||
        moment(selectedEvent.startDate).isSame(
          selectedEvent.endDate,
          "minute"
        ) ? (
          <> {moment(selectedEvent.startDate).format("MMM Do YYYY hh:mm A")}</>
        ) : (
          <>
            {moment(selectedEvent.startDate).format("MMM Do YYYY hh:mm A")} -{" "}
            {moment(selectedEvent.endDate).format("hh:mm A")}
          </>
        );
    } else {
      formatDate = (
        <>
          From {moment(selectedEvent.startDate).format("MMM Do YYYY hh:mm A")}
          <br /> To{" "}
          {moment(selectedEvent.endDate).format("MMM Do YYYY hh:mm A")}
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
                {selectedEvent.title}
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
                      className={
                        "fa fa-square align-middle " + selectedEvent.bgColor
                      }
                    ></span>
                  </div>
                  <div className="col-11 text-wrap text-left">
                    {formatingDate()}
                  </div>
                </div>
                {selectedEvent.description ? (
                  <div className="row">
                    <div className="col-1">
                      <span className="fa fa-file"></span>
                    </div>
                    <div className="col-11 text-wrap text-left">
                      {selectedEvent.description}
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
                    {selectedEvent.owner.name}
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
