import React from "react";
import DatePicker from "react-datepicker";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import { createEvent } from "../apiCalendar";
import "react-datepicker/dist/react-datepicker.css";
import { isAuthenticated } from "../../auth";
import * as Yup from "yup";

const EventInfoValidation = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must to be more than 1 characters.")
    .max(75, "Title must be under 75 characters.")
    .matches(/^([a-zA-Z0-9 ])+$/, "Title can only contain letters and numbers"),
});

const EventForm = (props) => {
  const { modalId, modalTitle, eventInfo, closeModal } = props;

  const submitFunction = (eventData) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    let eData = eventData;

    if (modalId === "add-event") {
      eData.owner = isAuthenticated().user._id;
      createEvent(userId, token, eData).then((data) => {
        if (data.error) {
          console.log("error");
        }
        closeModal();
      });
    }
  };
  return (
    <div className="modal" id={modalId} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
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
                <div className="modal-body p-3">
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
                          dateFormat="Pp"
                          name="startDate"
                          className="form-control"
                          selected={values.startDate}
                          onChange={(date) => setFieldValue("startDate", date)}
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
                            dateFormat="Pp"
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
                      <option value="bg-Primary"> Blue</option>
                      <option value="bg-warning"> Yellow</option>
                      <option value="bg-success"> Green</option>
                      <option value="bg-danger"> Red</option>
                      <option value="bg-info"> Light Blue</option>
                    </Field>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary save"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Please wait..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light cancel"
                    data-dismiss="modal"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
