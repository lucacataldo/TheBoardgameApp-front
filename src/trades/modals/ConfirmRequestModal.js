import React from "react";
import ReactModal from "react-modal";
import { FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { createTrade } from "../apiTrade";
import { isAuthenticated } from "../../auth";
import { Redirect } from "react-router-dom";

export default class ConfirmRequestModal extends React.Component {
  state = {
    notes: "",
    redirect: null,
    tradeId: null
  };

  componentWillMount() {
    //Required to use modal or else it has errors
    ReactModal.setAppElement("body");
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  submitTrade = () => {
    const token = isAuthenticated().token;
    this.props.tradeData.notes = document.getElementById("tradeNotes").value;
    createTrade(token, this.props.tradeData).then(data => {
      //data returned is only _id of trade
      this.setState({ redirect: "/requestSent", tradeId: data });
    });
  };

  render() {
    const style = {
      content: {
        borderRadius: "4px",
        bottom: "100px",
        left: "15%",
        position: "absolute",
        right: "100px",
        top: "100px",
        width: "80%",
        height: "80%"
      }
    };

    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: this.state.redirect,
            state: { tradeId: this.state.tradeId }
          }}
        />
      );
      // return <RequestSent redirect={this.state.redirect}></RequestSent>
    }
    return (
      <ReactModal isOpen={this.props.show} style={style}>
        <div className="container-fluid">
          <div>
            <h1>
              Confirm Request
              <button
                type="button"
                className="close float-right"
                onClick={this.onClose}
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h1>
          </div>
          <div className="row">
            <div className="col-6">
              <h3>You</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.tradeData.userTradeList.map(item => {
                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.condition}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th>Total Value:</th>
                    <td colSpan="2">${this.props.tradeData.userTotalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-6">
              <h3>{this.props.tradeData.searchedUser}</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.tradeData.searchedUserTradeList.map(item => {
                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>null</td>
                        <td>null</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th>Total Value:</th>
                    <td colSpan="2">$null</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-6">
              <FormGroup
                style={{ bottom: "10%", position: "fixed", width: "40%" }}
              >
                <Label for="notes">Notes</Label>
                <Input
                  type="textarea"
                  maxLength="500"
                  style={{ resize: "none" }}
                  rows="5"
                  name="notes"
                  id="tradeNotes"
                  placeholder="500 characters max."
                />
              </FormGroup>
            </div>
            <div className="col">
              <button
                style={{ bottom: "15%", right: "10%", position: "fixed" }}
                className="btn btn-success"
                onClick={this.submitTrade}
              >
                Confirm Trade
                <br />
                <FontAwesomeIcon
                  size="lg"
                  icon={faExchangeAlt}
                ></FontAwesomeIcon>
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }
}
