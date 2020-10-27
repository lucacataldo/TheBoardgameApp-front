import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";

import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";

class NewEvent extends Component {
  constructor() {
    super();
    this.state = {
      event: {
        id: "",
        title: "",
        allDay: false,
        startDate: new Date(),
        endDate: new Date(),
        owner: "",
        bgColor: "",
      },
    };
  }

  componentDidMount() {
    const userId = this.props.userId;
    if (
      isAuthenticated().user._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      //if not owner view only
    }
  }

  reset() {
    this.setState({
      event: {
        title: "",
        allDay: false,
        startDate: new Date(),
        endDate: new Date(),
        owner: "",
        bgColor: "eventTag-Blue",
      },
    });
  }

  closeModal = () => {
    this.reset();
  };

  render() {
    const { event } = this.state;
    return (
      <>
        <EventForm
          modalId="add-event"
          modalTitle="Add Event"
          eventInfo={{
            event,
          }}
          userId={this.props.userId}
          closeModal={this.closeModal}
        />
      </>
    );
  }
}
export default NewEvent;
