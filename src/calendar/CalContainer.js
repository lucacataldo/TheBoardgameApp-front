import React, { useEffect, useState, useMemo } from "react";
import { Redirect } from "react-router-dom";
import "./calStyle.css";

import SideBar from "./CalSideBar";
import Calendar from "./Calendar";
import { getEventsByUserId } from "./apiCalendar";
import { isAuthenticated } from "../auth";
import { EventContext } from "../context/EventContext";

import Animator from "../animator/Animator";

const CalContainer = (props) => {
  const userId = props.match.params.userId;
  const [redirectTo, setRedirectTo] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    _id: "",
    title: "",
    allDay: false,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-Blue",
    boardgames: [],
    tempBoardgame: "",
  });

  const eventValues = useMemo(
    () => ({ events, setEvents, selectedEvent, setSelectedEvent }),
    [events, selectedEvent]
  );

  useEffect(() => {
    getEventsByUserId(userId, isAuthenticated().token).then((data) => {
      if (data.error) {
        setRedirectTo(true);
      } else {
        setEvents(data);
      }
    });
  }, [userId]);

  return (
    <>
      {redirectTo ? (
        <Redirect to={`/404`} />
      ) : (
        <EventContext.Provider value={eventValues}>
          <div className="container-fluid calContainer">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <SideBar userId={userId} />
                      <Calendar userId={userId} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EventContext.Provider>
      )}
    </>
  );
};

export default CalContainer;
