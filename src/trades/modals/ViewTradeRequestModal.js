import React from "react";
import ReactModal from 'react-modal';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from "react-router-dom";


export default class ViewTradeRequestModal extends React.Component {
  state = {
    notes: "",
    redirect: null,
    tradeId: null,
  }

  componentWillMount() {
    //Required to use modal or else it has errors
    ReactModal.setAppElement('body');
}

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };


  render() {
      console.log(this.props.tradeData);
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


    if (this.state.redirect) {
      return <Redirect to={{
        pathname: this.state.redirect,
        state: { tradeId: this.state.tradeId }
      }} />
      // return <RequestSent redirect={this.state.redirect}></RequestSent>
    }
    return (
      <ReactModal isOpen={this.props.show} style={style}>
        <div className="container-fluid">

          <div>
            <h1>
              Confirm Request
          <button type="button" className="close float-right" onClick={this.onClose} data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </h1>


          </div >
          <div className="row">
            <div className="col-12">
              {/* <h3>{ this.props.tradeData.tradeSender.name}</h3> */}
              {/* <ul>
{this.props.tradeData.tradeOffer.map(game=>{
 return <li key={game._id}>{game.name}</li>
})}

              </ul>
                <ul>
{this.props.tradeData.tradeWants.map(game=>{
    return <li key={game._id}>{game.name}</li>

})}

                </ul> */}

                
            </div>


          </div>
        </div>

      </ReactModal>

    );
  }
}
