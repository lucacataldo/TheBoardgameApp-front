import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import TradeRequest from "./TradeRequest";
import TradeResponse from "./TradeResponse";
import TradePending from "./TradePending";
import { Redirect } from "react-router-dom";
import { getAllTradeRequests } from "./apiTrade";
class Trades extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false,
      tradeResponses: [],
      tradeRequests: []
    };
  }

  componentWillMount(){
    getAllTradeRequests().then(data =>{
      let userId = isAuthenticated().user._id;
     let outgoingRequests =  data.filter(trade => userId === trade.tradeSender._id);
     let incomingRequests = data.filter(trade => userId === trade.tradeReceiver._id);
        console.log(outgoingRequests);
        console.log(incomingRequests);
      this.setState({tradeResponses: incomingRequests, tradeRequests: outgoingRequests});
    })
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
          <TradeRequest trades={this.state.tradeRequests}/>
          <br/>
          <TradeResponse trades={this.state.tradeResponses}/>
          <br/>
          <TradePending/>

          
          </div>
        </div>
      </div>
    );
  }
}
export default Trades;