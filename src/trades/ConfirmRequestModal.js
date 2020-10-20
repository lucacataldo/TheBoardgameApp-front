import React from "react";
import ReactModal from 'react-modal';
import {FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { createTrade } from "./apiTrade";
import { isAuthenticated } from "../auth";


export default class ConfirmRequestModal extends React.Component {
state = {
  notes: ""
}

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  submitTrade = () => {
    const token = isAuthenticated().token;
    this.props.tradeData.notes = document.getElementById("tradeNotes").value;
    createTrade(token, this.props.tradeData).then(data => {
      /*CREATE LOGIC FOR redirect after trade*/
    });

  };

  render() {
    const style = {
      content: {
        borderRadius: '4px',
        bottom: '100px',
        left: '15%',
        position: 'absolute',
        right: '100px',
        top: '100px',
        width: '80%',
        height: '80%'
      }
    };
    return (
      <ReactModal isOpen={this.props.show} style={style}>
        <div className="container-fluid">

          <div><h1>Confirm Request<button className="toggle-button float-right"
                onClick={
                  this.onClose
                }
              >
                &times;
        </button></h1>
          

          </div >
          <div className="row">
            <div className="col-6">
              <h3>You</h3>
              <table className="table table-bordered">
                <tr><th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Condition</th>
                </tr>

                {this.props.tradeData.userTradeList.map(item => {
                  return <tr>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.condition}</td>
                    </tr>;
                })}
              </table>
            </div>

            <div className="col-6">
            <h3>{this.props.tradeData.searchedUser}</h3>
              <table className="table table-bordered">
                <tr><th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Condition</th></tr>

                {this.props.tradeData.searchedUserTradeList.map(item => {
                  return <tr>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.condition}</td>
                  </tr>;
                })}
              </table>
            </div>
                
            <div className="col-6">
            <FormGroup style={{bottom:'10%',position:'fixed',width:'40%'}}>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" maxlength="500" style={{resize:'none'}} rows="5" name="notes" id="tradeNotes" placeholder="500 characters max." />
                  </FormGroup>
            </div>
                <div className="col">
                  <button style={{bottom:'15%',right:'10%',position:'fixed'}} className="btn btn-success" onClick={this.submitTrade}>Confirm Trade<br /><FontAwesomeIcon size="lg" icon={faExchangeAlt}></FontAwesomeIcon></button>
                </div>
            
          </div>
        </div>

      </ReactModal>

    );
  }
}
