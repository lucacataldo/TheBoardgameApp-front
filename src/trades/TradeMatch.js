import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Redirect } from "react-router-dom";
import Animator from "../animator/Animator"
class TradeMatch extends React.Component {
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
    } else{
        Animator.animate()
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
                highlight= "TradeMatch"
            />
            <div className="col-sm-6 col-lg-6 animator">
                <h4>Matching Trades</h4>
            </div>
        </div>
      </div>
    );
  }
}
export default TradeMatch;