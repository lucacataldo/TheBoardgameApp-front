import React from "react";

import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
const ViewEvent = (props) => {
  const { event, modalId } = props;
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
        {moment(event.startDate).format("MMM Do YYYY hh:mm A")}
        <br /> to {moment(event.endDate).format("MMM Do YYYY hh:mm A")}
      </>
    );
  }

  return (
    <>
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="eventViewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
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
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEvent;
