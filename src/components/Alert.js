import React from "react";

class Alert extends React.Component {
  render() {
    if (this.props.visible === true) {
      return (
        <div className="row stickyAlert">
          <div
            className={
              "col-12 alert alert-" +
              this.props.type +
              (this.props.className ? " " + this.props.className : "")
            }
          >
            {this.props.message}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
