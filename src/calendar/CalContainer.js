import React from "react";
import AppState from "../context/App/AppState";
import SideBar from "./CalSideBar";
import Calendar from "./Calendar";
import "./calStyle.css";
const CalContainer = () => {
  return (
    <AppState>
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
    </AppState>
  );
};

export default CalContainer;
