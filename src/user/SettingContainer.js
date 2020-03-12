import React from "react";
import { isAuthenticated } from "../auth";
import SettingSidebar from "./SettingSideBar";
import { Redirect } from "react-router-dom";
class SettingContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false
    };
  }

  componentDidMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }
  }

  render() {
    const { redirectToHome } = this.state;
    if (redirectToHome) return <Redirect to="/" />;

    return (
      <div className="maxDivWidth container-fluid">
        <div className="row my-3">
          {/* SettingSidebar is col-sm-3 */}
          <SettingSidebar
            highlight={this.props.sidebar}
            userId={this.props.userId}
          />
          <div className="col-sm-9">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
export default SettingContainer;
