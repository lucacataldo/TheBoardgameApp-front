import React, { useContext } from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import { isAfter } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "react-bootstrap";

import { createEvent } from "../apiCalendar";
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
  const {
    modalId,
    modalTitle,
    eventInfo,
    resetModal,
    showModal,
    handleCloseModal,
  } = props;
  const { events, setEvents } = useContext(EventContext);

  const submitFunction = (eventData) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    if (modalId === "add-event") {
      createEvent(userId, token, eventData).then((data) => {
        if (data.error) {
          console.log("error");
        } else {
          let userEvents = [...events];
          userEvents.push(data);
          setEvents(userEvents);
        }
        resetModal();
        handleCloseModal();
      });
    }
  };

  return (
    <>
      <Modal centered id={modalId} show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
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
              <Modal.Body>
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
                        timeFormat="p"
                        timeIntervals={15}
                        dateFormat="PP"
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
                          timeFormat="p"
                          timeIntervals={1}
                          dateFormat="PP"
                          minDate={values.startDate}
                          className="form-control"
                          selected={values.endDate}
                          name="endDate"
                          onChange={(date) => setFieldValue("endDate", date)}
                        />
                      ) : (
                        <DatePicker
                          className="form-control"
                          dateFormat="PP"
                          minDate={values.startDate}
                          selected={values.endDate}
                          name="endDate"
                          onChange={(date) => setFieldValue("endDate", date)}
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
                  <label className="control-label">Choose Event Color</label>
                  <Field
                    as="select"
                    className="form-control form-white"
                    name="bgColor"
                  >
                    <option value="eventTag-blue"> Blue</option>
                    <option value="eventTag-yellow"> Yellow</option>
                    <option value="eventTag-green"> Green</option>
                    <option value="eventTag-red"> Red</option>
                    <option value="eventTag-lightBlue"> Light Blue</option>
                  </Field>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  type="submit"
                  className="btn btn-primary save"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Submit"}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default EventForm;
