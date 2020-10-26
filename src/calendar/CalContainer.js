import React from "react";
import SideBar from "./CalSideBar";
import Calendar from "./Calendar";
import "./calStyle.css";

const CalContainer = (props) => {
  const userId = props.match.params.userId;
  return (
    <div className="wrapper calContainer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <SideBar userId={userId} />
                  <Calendar userId={props.match.params.userId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalContainer;
