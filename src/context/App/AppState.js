import React, { useReducer } from "react";
import AppReducer from "./appReducer";
import AppContext from "./appContext";
import { ADD_EVENT } from "../types";

const AppState = (props) => {
  const initialState = {
    events: [],
    colors: ["Primary", "Success", "Info", "Warning", "Danger"],
    selectedEvent: {},
  };
  // accept reducer fxn w/ init state
  // return current state then dispathes a fxn
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const addEvent = (event) => {
    let userEvents = [...state.events]; // pass the array to new array
    userEvents.push(event);

    dispatch({
      type: ADD_EVENT, //type of action to use
      payload: userEvents, // where we want to perform the action
    });
  };
  return (
    <AppContext.Provider
      value={{
        events: state.events,
        colors: state.colors,
        selectedEvent: state.selectedEvent,
        addEvent,
        // colorObj: state.colorObj,
        // activeCalendarEvents: state.activeCalendarEvents,
        // addEvent,
        // getEvents,
        // selected,
        // editSelectedEvent,
        // deleteSelectedEvent,
        // activeEvents,
        // getActiveEvents
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
