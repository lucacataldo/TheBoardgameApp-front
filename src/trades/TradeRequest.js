import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye, faTimes, faClosedCaptioning } from "@fortawesome/free-solid-svg-icons";

class TradeRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          redirectToHome: faClosedCaptioning
        };
      }
    
      componentDidUpdate(prevProps){
        if (this.props.id !== prevProps.id) {
         this.setState({id: this.props.id});
       }
     }

      
    render() {
        return (
         <div className="card" >
            <div className="card-header">Waiting for Response</div>
        <div className="card-body">
        {this.props.trades.map(trade=>{
                return (
            <div key={trade._id} className="row justify-content-center align-self-center mt-1">
              
                <div className="col-md-2" >
                <img className="rounded-circle" src="https://via.placeholder.com/100" alt="displaypic"/>
                </div>
                <div className="col-md-6 mt-4">
      
                    <a className="font-weight-bold h5" href={'user/' + trade.tradeReceiver._id}>{trade.tradeReceiver.name} </a>
                    <br/>
                    <small>{trade.tradeWants.length} games</small>
                       
                </div>
                <div className="col-md-4 mt-4">
                    <button type="button" onClick={()=> this.props.onClickDelete(trade._id)} className="btn btn-danger float-right"><FontAwesomeIcon icon={faTimes} /> Cancel</button>
                <button type="button" className="btn btn-primary float-right mx-2"><FontAwesomeIcon icon={faEye} /> View</button>
                
                </div></div>);        
                })}
            
            <div className="card-footer text-center"><a href="/" className="btn btn-primary">Show More</a></div>
        </div>
        </div> )
                
                  
    }
  }
  export default TradeRequest;