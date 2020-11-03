import React, { useContext, useState, useEffect } from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import { isAfter, isEqual, isSameDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";

import { createEvent, getEventsByUserId, updateEvent } from "../apiCalendar";
import { isAuthenticated } from "../../auth";
import { EventContext } from "../../context/EventContext";

const EventInfoValidation = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must to be more than 1 characters.")
    .max(75, "Title must be under 75 characters.")
    .matches(/^([a-zA-Z0-9 ])+$/, "Title can only contain letters and numbers"),
});

const EventForm = (props) => {
  const { modalId, modalTitle, eventInfo, resetModal } = props;
  const { events, setEvents, selectedEvent } = useContext(EventContext);
  useEffect(() => {}, [selectedEvent, events]);
  const [eventColor, setEventColor] = useState("#0275d8");
  const submitFunction = (eventData) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    eventData.allDay = isEqual(eventData.startDate, eventData.endDate);
    if (modalId === "add-event") {
      createEvent(userId, token, eventData).then((data) => {
        if (data.error) {
          console.log("error");
        } else {
          getEventsByUserId(userId, token).then((data) => {
            setEvents(data);
          });
        }
        resetModal();
      });
      $("#closeModal").click();
    } else if (modalId === "edit-event") {
      updateEvent(eventData._id, token, eventData).then((data) => {
        if (data.error) {
          console.log("error");
        } else {
          getEventsByUserId(userId, token).then((data) => {
            setEvents(data);
          });
        }
      });
      $("[data-dismiss='modal']").click();
    }

    $("#" + modalId).on("hidden.bs.modal", function () {
      //remove the backdrop
      $(".modal-backdrop").remove();
    });
  };

  const getColor = (color) => {
    switch (color) {
      case "eventTag-blue":
        setEventColor("#0275d8");
        return;
      case "eventTag-red":
        setEventColor("#d9534f");
        return;
      case "eventTag-yellow":
        setEventColor("#f0ad4e");
        return;
      case "eventTag-green":
        setEventColor("#5cb85c");
        return;
      case "eventTag-lightBlue":
        setEventColor("#5bc0de");
        return;
      default:
        setEventColor("#0275d8");
        return;
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="eventLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="eventLabel">
                {modalTitle}
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
            <Formik
              enableReinitialize={true}
              initialValues={eventInfo.event}
              validationSchema={EventInfoValidation}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  submitFunction(values);
                  setSubmitting(false);
                }, 2000);
              }}
            >
              {({ touched, errors, values, isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="control-label">Event Title</label>
                      <Field
                        className={
                          getIn(errors, "title") && getIn(touched, "title")
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="Enter Title"
                        type="text"
                        name="title"
                      />
                      <ErrorMessage
                        component="div"
                        name="title"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        name="allDay"
                        id="allDayEventChkBox"
                        checked={values.allDay}
                        value={values.allDay}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="allDayEventChkBox"
                      >
                        All-day event? (optional)
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Start</label>
                      <div className="row">
                        <div className="col-md-12">
                          <DatePicker
                            showTimeSelect
                            minDate={new Date()}
                            timeIntervals={15}
                            dateFormat="MMM d, yyyy h:mm aa"
                            name="startDate"
                            className="form-control"
                            selected={values.startDate}
                            onChange={(date) => {
                              if (isAfter(date, values.endDate)) {
                                setFieldValue("endDate", date);
                              }
                              setFieldValue("startDate", date);
                            }}
                          />
                        </div>
                      </div>
                      <ErrorMessage
                        component="div"
                        name="startDate"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label>End</label>
                      <div className="row">
                        <div className="col-md-12">
                          {!values.allDay ? (
                            <DatePicker
                              showTimeSelect
                              timeIntervals={1}
                              dateFormat="MMM d, yyyy h:mm aa"
                              minDate={values.startDate}
                              className="form-control"
                              selected={
                                isAfter(values.endDate, values.startDate) ||
                                isSameDay(values.endDate, values.startDate)
                                  ? values.endDate
                                  : values.startDate
                              }
                              name="endDate"
                              onChange={(date) =>
                                setFieldValue("endDate", date)
                              }
                            />
                          ) : (
                            <DatePicker
                              className="form-control"
                              dateFormat="MMM d, yyyy"
                              minDate={values.startDate}
                              selected={values.endDate}
                              name="endDate"
                              onChange={(date) =>
                                setFieldValue("endDate", date)
                              }
                            />
                          )}
                        </div>
                      </div>
                      <ErrorMessage
                        component="div"
                        name="endDate"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label className="control-label">
                        Choose Event Color
                      </label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend ">
                          <label className="input-group-text" htmlFor="bgColor">
                            <FontAwesomeIcon
                              icon={faCalendarWeek}
                              style={{ color: eventColor }}
                            />
                          </label>
                        </div>
                        <Field
                          as="select"
                          className="form-control form-white"
                          name="bgColor"
                          onClick={() => {
                            getColor(values.bgColor);
                          }}
                        >
                          <option value="eventTag-blue">Blue</option>
                          <option value="eventTag-yellow"> Yellow</option>
                          <option value="eventTag-green"> Green</option>
                          <option value="eventTag-red"> Red</option>
                          <option value="eventTag-lightBlue">Light Blue</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary save"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Please wait..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      data-dismiss="modal"
                      id="closeModal"
                      className="btn btn-secondary"
                    >
                      close
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventForm;
