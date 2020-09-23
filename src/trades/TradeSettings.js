import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Redirect } from "react-router-dom";
class TradeSettings extends React.Component {
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
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar
            highlight= "TradeSettings"
          />
          <div className="col-sm-9 col-lg-10">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
export default TradeSettings;