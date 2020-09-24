import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Redirect } from "react-router-dom";

class TradeListItems extends React.Component {
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
          />
          <div className="col-sm-6 col-lg-6">
          <h4>Trade Information</h4>
            <div className="w-100 bg-white">
               <h4>Your Trade List Items</h4> 
            </div>
            <div className="row bg-white">
                <div className="col-md-6">
                    Available
                <br/>
                <div>Status</div>

                </div>
                <div className="col-md-1"></div>
                <div className="col-md-5"></div>
            </div>
          
          </div>
        </div>
      </div>
    );
  }
}
export default TradeListItems;