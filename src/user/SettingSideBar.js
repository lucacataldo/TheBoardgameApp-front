import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
class SettingSideBar extends React.Component {
  render() {
    return (
      <div
        className="col-sm-3 col-md-2"
        highlight={this.props.highlight}
      >
        <div className="list-group">
          <Link
            className={`list-group-item list-group-item-action ${
              this.props.highlight === "UserSetting" ? "active" : ""
            }`}
            to={`/user/edit/${isAuthenticated().user._id}`}
          >
            User Setting <span className="sr-only">(current)</span>
          </Link>
          <Link
            className={`list-group-item list-group-item-action ${
              this.props.highlight === "Boardgame" ? "active" : ""
            }`}
            to={`/boardgames`}
          >
            Boardgames
          </Link>
        </div>
      </div>
    );
  }
}
export default SettingSideBar;
