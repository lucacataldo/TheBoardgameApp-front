import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import TradeRequest from "./TradeRequest";
import TradePending from "./TradePending";
import { Redirect } from "react-router-dom";
import { getAllTradeRequestsById, deleteTrade, updateTradeStatus } from "./apiTrade";
import Animator from "../animator/Animator";
class Trades extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false,
      tradeResponses: [],
      tradeRequests: [],
      tradePending: []
    };
  }

  componentWillMount() {
    let userId = isAuthenticated().user._id;
    getAllTradeRequestsById(userId).then(data => {
      let outgoingRequests = data.filter(
        trade => userId === trade.tradeSender._id && trade.status !== "Pending"
      );
      let incomingRequests = data.filter(
        trade => userId === trade.tradeReceiver._id && trade.status !== "Pending"
      );
      let pendingRequests = data.filter(
        trade => trade.status === "Pending"
      );
      this.setState({
        tradeResponses: incomingRequests,
        tradeRequests: outgoingRequests,
        tradePending: pendingRequests
      });
    });
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

  onClickRemoveTrade = tradeId => {
    const token = isAuthenticated().token;
    try{

      deleteTrade(token, tradeId).then(data => {
      console.log("inDelete");
      if (data.error) {
        console.log(data.error);
      }
    }); 
    let newList = this.state.tradeRequests.filter(
      request => request._id !== tradeId
    );
    this.setState({ tradeRequests: newList });
    }catch(err){
      console.error(err);
    }
    
   
  };

  onClickAcceptTrade = tradeId => {
    const token = isAuthenticated().token;
    try{

      updateTradeStatus(token, tradeId, "Pending").then(data => {
      if (data.error) {
        console.log(data.error);
      }else{
        console.log(data);
      }
    }); 
    let newList = this.state.tradeRequests.filter(
      request => request._id !== tradeId
    );
    this.setState({ tradePending: newList });
    }catch(err){
      console.error(err);
    }
    
   
  };

  render() {
    const { redirectToHome } = this.state;
    if (redirectToHome) return <Redirect to="/" />;

    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar highlight="Trades" />
          <div className="col-sm-6 col-lg-6 animator">
            <h4>My Trades</h4>
            <TradeRequest
              trades={this.state.tradeRequests}
              onClickDelete={this.onClickRemoveTrade.bind(this)}
              header="Waiting for Response"
              deleteText="Remove"
            />
            <br />
            <TradeRequest
              trades={this.state.tradeResponses}
              onClickAccept={this.onClickAcceptTrade.bind(this)}
              header="Response Needed"
              deleteText="Reject"
              successButton="Accept"
            />
            <br />
            <TradePending
            trades={this.state.tradePending} />
          </div>
        </div>
      </div>
    );
  }
}
export default Trades;
