import React from "react";
import { isAuthenticated } from "../auth";

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
              <div className="row" key={trade._id}>
                <img
                  id={"toggle".concat(trade._id)}
                  className="col-1 float-left rounded-circle cursor-pointer p-2"
                  src="https://picsum.photos/75"
                  alt="displaypic"
                />
                <p className="col-5 pl-3 pt-3">
                  <a
                    className="font-weight-bold h5"
                    href={"user/" + trade.tradeSender._id}
                  >
                    {trade.tradeSender.name}{" "}
                  </a>
                  <br />
                  <small>{trade.tradeWants.length} games</small>
                </p>

                <div className="col-4 ">
                  <div className="float-right">
                    <button type="button" className="btn btn-success mx-2 my-3">
                      Complete
                    </button>
                  </div>
                </div>
                <div className="col-2">
                  {new Date(trade.createdDate).toISOString().slice(0, 10)}
                </div>
                {/* <UncontrolledCollapse toggler={"#toggle".concat(trade._id)}>
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
                </UncontrolledCollapse> */}
                <hr className="col-4 bg-black" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default TradePending;
