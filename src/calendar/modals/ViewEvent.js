import React, { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faChessKing,
  faChessKnight,
  faClipboard,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

import { EventContext } from "../../context/EventContext";
import { isAuthenticated } from "../../auth";

const ViewEvent = (props) => {
  const { selectedEvent } = useContext(EventContext);

  const formatingDate = () => {
    let formatDate = selectedEvent.allDay ? (
      <> {moment(selectedEvent.startDate).format("dddd, MMM Do h:mm A")}</>
    ) : (
      <>
        {moment(selectedEvent.startDate).format("dddd, MMM Do h:mm A")} -{" "}
        {moment(selectedEvent.endDate).format("h:mm A")}
      </>
    );
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
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-1">
                    <FontAwesomeIcon
                      icon={faCalendarCheck}
                      className={selectedEvent.bgColor}
                    />
                  </div>
                  <div className="col-11 text-wrap text-left">
                    <h5 className="mb-0">{selectedEvent.title}</h5>
                    {formatingDate()}
                  </div>
                </div>
                {selectedEvent.description && (
                  <div className="row mb-2">
                    <div className="col-1">
                      <FontAwesomeIcon icon={faClipboard} />
                    </div>
                    <div
                      className="col-11 text-wrap text-left overflow-auto"
                      style={{ maxHeight: "40vh" }}
                    >
                      {selectedEvent.description}
                    </div>
                  </div>
                )}
                {selectedEvent.boardgames.length > 0 && (
                  <div className="row mb-2">
                    <div className="col-1">
                      <FontAwesomeIcon icon={faChessKnight} />
                    </div>
                    <div className="col-11 text-wrap text-left">
                      {selectedEvent.boardgames.map((bg) => {
                        return (
                          <div key={bg._id}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={
                                "https://boardgamegeek.com/boardgame/" +
                                `${bg.bggId}`
                              }
                            >
                              {bg.title}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="row mb-2">
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
              {isAuthenticated().user._id === selectedEvent.owner._id && (
                <button
                  type="button"
                  data-dismiss="modal"
                  data-toggle="modal"
                  data-target="#edit-event"
                  className="btn btn-warning"
                >
                  Edit Event
                </button>
              )}
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
