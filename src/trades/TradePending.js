import React from "react";
import { isAuthenticated } from "../auth";
import { UncontrolledCollapse, Button, CardBody, Card } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faCommentDots,
  faEye
} from "@fortawesome/free-solid-svg-icons";

class TradePending extends React.Component {
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
  badgeBgRender = condition => {
    switch (condition) {
      case "Excellent":
        return "badge-success";
      case "Good":
        return "badge-primary";
      case "Fair":
        return "badge-warning";
      case "Poor":
        return "badge-danger";
      default:
        return null;
    }
  };
  render() {
    return (
      <div className="card">
        <div className="card-header">Pending Trade</div>
        <div className="card-body">
          {this.props.trades.map(trade => {
            return (
              <div key={trade._id}>
                
                  <img
                    id={"toggle".concat(trade._id)}
                    className="float-left rounded-circle cursor-pointer"
                    src="https://picsum.photos/75"
                    alt="displaypic"
                  />

                  <div className="float-left pt-3 pl-3">
                    <a
                      className="font-weight-bold h5"
                      href={"user/" + trade.tradeSender._id}
                    >
                      {trade.tradeSender.name}{" "}
                    </a>
                    <br />
                    <small>{trade.tradeWants.length} games</small>
                  </div>
                  <br/>
                  <div className="top-right">
                    {new Date(trade.createdDate).toISOString().slice(0, 10)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-info float-right rounded-circle mx-3"
                  >
                    <FontAwesomeIcon icon={faCommentDots} />
                  </button>   
                  <button
                    type="button"
                    className="btn btn-danger float-right rounded-circle"
                  >
                    <FontAwesomeIcon icon={faTimes} />{" "}
                  </button>
                  <button
                    type="button"
                    className="btn btn-success float-right mr-3 rounded-circle"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
               
                {/* <button type="button"  className="btn btn-primary float-left"><FontAwesomeIcon icon={faEye} /></button> */}

                <UncontrolledCollapse toggler={"#toggle".concat(trade._id)}>
                  <br />
                  <br />
                  <br />
                  <hr />
                  <div className="row">
                    <div className="col">
                      <h4>Wants:</h4>
                      {trade.tradeWants.map(game => (
                        <p key={game._id}>
                          {game.name}{" "}
                          <span
                            className={`badge ${this.badgeBgRender(
                              game.condition
                            )} float-right mt-1`}
                          >
                            {game.condition === "N/A" ? null : game.condition}
                          </span>
                        </p>
                      ))}
                    </div>
                    <div className="col">
                      <h4>Offer:</h4>
                      {trade.tradeOffer.map(game => (
                        <p key={game._id}>
                          {game.name}{" "}
                          <span
                            className={`badge ${this.badgeBgRender(
                              game.condition
                            )} float-right mt-1`}
                          >
                            {game.condition === "N/A" ? null : game.condition}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <h4>Notes:</h4>
                      <p>{trade.notes}</p>
                    </div>
                  </div>
                </UncontrolledCollapse>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default TradePending;
