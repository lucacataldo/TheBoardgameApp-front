import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import React from "react";
import { getUser } from "../user/apiUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

class TradesSideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      loading: false,
      file: null
    };
  }
  init = userId => {
    const token = isAuthenticated().token;
    getUser(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          name: data.name
        });
      }
    });
  };

  componentDidMount() {
    let userId = isAuthenticated().user._id;
    this.init(userId);
  }



  render() {
    
    return (
      <>
        <div
          className="col-sm-3 col-lg-2 maxSidebarWidth ml-3 justify-content-right mt-5"
          highlight={this.props.highlight}
        >
          <div className="list-group ">
            <span className="list-group-item list-group-item-dark font-weight-bold">
              Trades
            </span>

            <Link
              className={`btn btn-success text-left my-1 font-weight-bold`}
              to={`/newTrade`}
            >
              <span ><FontAwesomeIcon  icon={faPlusCircle}></FontAwesomeIcon> </span>
                New Trade <span className="sr-only">(current)</span>
            </Link>


            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "Trades" ? "active" : ""
              }`}
              to={`/trades`}
            >
              My Trades <span className="sr-only">(current)</span>
            </Link>
            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "TradeMatch" ? "active" : ""
              }`}
              to={`/trades/matches`}
            >
              Match Trades
            </Link>
            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "TradeSettings" ? "active" : ""
              }`}
              to={`/trades/settings`}
            >
              Trade Settings
            </Link>
          </div>
        </div>
      </>
    );
  }
}
export default TradesSideBar;
