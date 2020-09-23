import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import TradeRequest from "./TradeRequest";
import TradeResponse from "./TradeResponse";
import TradePending from "./TradePending";
import { Redirect } from "react-router-dom";
class Trades extends React.Component {
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
            highlight= "Trades"
          />
          <div className="col-sm-6 col-lg-6">
          <h4>My Trades</h4>
          <TradeRequest/>
          <br/>
          <TradeResponse/>
          <br/>
          <TradePending/>

          
          </div>
        </div>
      </div>
    );
  }
}
export default Trades;