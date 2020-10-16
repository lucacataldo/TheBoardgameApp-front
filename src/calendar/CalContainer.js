import React from "react";

import SideBar from "./CalSideBar";
import Calendar from "./Calendar";
import "./calStyle.css";
const CalContainer = () => {
  return (
    <div className="wrapper calContainer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <SideBar />
                  <Calendar />
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
