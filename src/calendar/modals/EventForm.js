import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { Formik, Form, Field, ErrorMessage, getIn, FieldArray } from "formik";
import { isAfter, isEqual } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import Select from "react-select";

import { createEvent, getEventsByUserId, updateEvent } from "../apiCalendar";
import { isAuthenticated } from "../../auth";
import { EventContext } from "../../context/EventContext";
import Alert from "../../components/Alert";

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
  const [changeText, setChangeText] = useState(false);
  const [filterBoardgames, setFilterBoardgames] = useState([]);
  useEffect(() => {}, [selectedEvent, events]);

  const submitFunction = (eventData) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    eventData.allDay = isEqual(eventData.startDate, eventData.endDate);

    const bg = eventData.boardgames;

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

  const [selectedValue, setSelectedValue] = useState([]);
  const filterBoardgame = (value) => {
    console.log("filter boardgame" + changeText);
    if (changeText === true) {
      console.log("filter value: " + value);
      const boardgames = isAuthenticated().user.boardgames;
      console.log(boardgames);
      const FilterBg = boardgames.filter((bg) =>
        bg.boardgame.title.includes(value)
      );
      setFilterBoardgames(FilterBg);
    }
  };
  const handleChange = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.boardgame._id) : []);
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
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
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
              initialValues={eventInfo}
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
                    <div className="container-fluid">
                      <div className="form-group row">
                        <label className="col-form-label col-lg-2">Title</label>
                        <Field
                          className={
                            getIn(errors, "title") && getIn(touched, "title")
                              ? "form-control is-invalid  col-lg-10"
                              : "form-control  col-lg-10"
                          }
                          placeholder="Enter Title"
                          type="text"
                          name="title"
                        />
                        <ErrorMessage
                          component="div"
                          name="title"
                          className="offset-lg-2 offset-sm-3 invalid-feedback"
                        />
                      </div>
                      <div className="form-group row">
                        <label className="col-form-label col-lg-2">
                          Description
                        </label>
                        <Field
                          className={
                            getIn(errors, "description") &&
                            getIn(touched, "description")
                              ? "form-control is-invalid col-lg-10"
                              : "form-control col-lg-10"
                          }
                          placeholder="Tell people what your event is about"
                          type="text"
                          name="description"
                          component="textarea"
                        />
                        <ErrorMessage
                          component="div"
                          name="description"
                          className="invalid-feedback offset-lg-2"
                        />
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <label className="col-form-label col-12 col-md-12 col-lg-2">
                            Time
                          </label>
                          <div className="col-12 col-md-5 col-lg-5 pl-0 pr-0 pr-md-2 ">
                            <DatePicker
                              minDate={new Date()}
                              dateFormat="EEEE MMM d, yyyy"
                              name="startDate"
                              className="form-control"
                              selected={values.startDate}
                              onChange={(date) => {
                                setFieldValue("endDate", date);
                                setFieldValue("startDate", date);
                              }}
                            />
                          </div>
                          <div className="col-5 col-md-3 col-lg-2 px-0 mt-2 mt-md-0">
                            <DatePicker
                              timeIntervals={15}
                              dateFormat="h:mm aa"
                              showTimeSelect
                              showTimeSelectOnly
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
                          <div className="col-2 col-md-1 col-lg-1 px-0 mt-2 mt-md-0 text-center align-self-center ">
                            <span className="fa fa-minus "></span>
                          </div>
                          <div className="col-lg-2 col-md-3 col-5 px-0 mt-2 mt-md-0">
                            <DatePicker
                              timeIntervals={15}
                              minTime={values.startDate}
                              maxTime={new Date(values.startDate).setHours(
                                23,
                                59
                              )}
                              dateFormat="h:mm aa"
                              showTimeSelect
                              showTimeSelectOnly
                              name="endDate"
                              className="form-control"
                              selected={values.endDate}
                              onChange={(date) => {
                                setFieldValue("endDate", date);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="form-check offset-lg-2">
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
                        </div>
                      </div>
                      {/* <div className="form-group row">
                        <label className="col-form-label col-lg-2">
                          Boardgames
                        </label>
                        <Field
                          className="form-control  col-lg-10"
                          placeholder="Add Boardgame"
                          name="tempBoardgame"
                          onKeyUp={(value) => {
                            setTimeout(() => {
                              setChangeText(true);
                              filterBoardgame(values.tempBoardgame);
                            }, 200);
                            setChangeText(false);
                          }}
                          type="text"
                        />
                      </div> */}
                      <div className="form-group row">
                        <label className="col-form-label col-lg-2">
                          Boardgames
                        </label>
                        <Select
                          options={isAuthenticated().user.boardgames}
                          getOptionLabel={(option) => option.boardgame.title}
                          getOptionValue={(option) => option.boardgame._id}
                          className="col-lg-10 px-0"
                          isMulti={true}
                          value={isAuthenticated().user.boardgames.filter(
                            (obj) =>
                              values.boardgames.includes(obj.boardgame._id)
                          )}
                          onChange={(value) => {
                            // handleChange(value);
                            setFieldValue(
                              "boardgames",
                              Array.isArray(value)
                                ? value.map((x) => x.boardgame._id)
                                : []
                            );
                            // setSelectedValue(Array.isArray(e) ? e.map((x) => x.boardgame._id) : []);
                            //console.log(values.boardgames);
                          }}
                          placeholder="Select boardgames to play"
                        />
                      </div>
                      <div className="form-group row">
                        <label className="col-form-label col-lg-2 ">
                          Event Color
                        </label>
                        <div className="input-group mb-3 col-lg-10 px-0">
                          <div className="input-group-prepend ">
                            <label
                              className="input-group-text"
                              htmlFor="bgColor"
                            >
                              <FontAwesomeIcon
                                icon={faCalendarWeek}
                                className={values.bgColor}
                              />
                            </label>
                          </div>
                          <Field
                            as="select"
                            className="form-control form-white"
                            name="bgColor"
                          >
                            <option value="eventTag-blue">Blue</option>
                            <option value="eventTag-yellow"> Yellow</option>
                            <option value="eventTag-green"> Green</option>
                            <option value="eventTag-red"> Red</option>
                            <option value="eventTag-lightBlue">
                              Light Blue
                            </option>
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
