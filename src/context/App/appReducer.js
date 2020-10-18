import {
  ADD_EVENT,
  GET_EVENTS,
  SELECT_EVENT,
  EDIT_EVENT,
  DELETE_EVENT,
  ACTIVE_EVENTS,
  GET_ACTIVE_EVENTS,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case ADD_EVENT:
      return {
        ...state, //pass old state
        events: action.payload, // updating with new action.payload
      };
    default:
      return state;
  }
};
