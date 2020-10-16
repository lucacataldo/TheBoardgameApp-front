import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventForm = (props) => {
  const {
    modalId,
    title,
    closeModal,
    eventname,
    inputChange,
    checkbox,
    onCheckBoxChange,
    showtime,
    startDate,
    endDate,
    onInputChange,
    handleChange,
    eventType,
    buttonText,
    color,
    colors,
  } = props;
  return (
    <div>
      <div className="modal" id="add-event" tabindex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
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
            <div className="modal-body p-3">
              <form>
                <div className="form-group">
                  <label className="control-label">Event Title</label>
                  <input
                    className="form-control fom-white"
                    placeholder="Enter Title"
                    type="text"
                    name="event-name"
                    value={eventname}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="checkbox"
                    id="allDayEventChkBox"
                    value={checkbox}
                    checked={checkbox}
                    onChange={onCheckBoxChange}
                  />
                  <label className="form-check-label" for="allDayEventChkBox">
                    All-day event? (optional)
                  </label>
                </div>
                <div className="form-group">
                  <label>Start</label>
                  <div className="row">
                    <div className="col-md-12">
                      <DatePicker
                        showTimeSelect
                        timeFormat="p"
                        timeIntervals={15}
                        dateFormat="Pp"
                        className="form-control"
                        selected={startDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>End</label>
                  <div className="row">
                    <div className="col-md-12">
                      {!showtime ? (
                        <DatePicker
                          showTimeSelect
                          timeFormat="p"
                          timeIntervals={1}
                          dateFormat="Pp"
                          selected={endDate}
                          onChange={onInputChange("enddate")}
                          className="form-control"
                        />
                      ) : (
                        <DatePicker
                          selected={endDate}
                          onChange={onInputChange("enddate")}
                          className="form-control"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">Choose Event Color</label>
                  <select
                    className="form-control form-white"
                    name="event-color"
                  >
                    <option>Select color</option>
                    {colors.map((color) => (
                      <option value={color.toLowerCase()} key={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary save"
                data-dismiss="modal"
                onClick={eventType}
                disabled={!eventname || !startDate || !endDate || !color}
              >
                {buttonText}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
