import React from "react";
import { isAuthenticated } from "../auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes, faCommentDots } from "@fortawesome/free-solid-svg-icons";


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
    render() {
        return <div className="card" >
        <div className="card-header">Pending Trade</div>
    <div className="card-body">
        <div className="row justify-content-center align-self-center mt-1">
            <div className="col-md-2">
            <img className="rounded-circle" src="https://via.placeholder.com/100" alt="displaypic"/>
            </div>
            <div className="col-md-4 mt-4">
  
                <a className="font-weight-bold h5" href="/">Jane Doe</a>
                <br/>
                <small>3 games</small>
                   
            </div>
            <div className="col-md-6 mt-4 ">
            <button type="button" className="btn btn-danger float-right"><FontAwesomeIcon icon={faTimes} /> Cancel</button>
            <button type="button" className="btn btn-success mx-2 float-right"><FontAwesomeIcon icon={faCheck} /> Completed</button>
            <button type="button" className="btn btn-info mx-2 float-right"><FontAwesomeIcon icon={faCommentDots} /> Chat</button>
            <button type="button" className="btn btn-primary mx-2 float-right"><FontAwesomeIcon icon={faEye} /> View</button>
            </div>        
        </div>

        <div className="row justify-content-center align-self-center mt-1">
            <div className="col-md-2">
            <img className="rounded-circle" src="https://via.placeholder.com/100" alt="displaypic"/>
            </div>
            <div className="col-md-4 mt-4">
                <a className="font-weight-bold h5" href="/">Joe Dae</a>
                <br/>
                <small>1 games</small>
            </div>
            <div className="col-md-6 mt-4 ">
            <button type="button" className="btn btn-danger float-right"><FontAwesomeIcon icon={faTimes} /> Cancel</button>
            <button type="button" className="btn btn-success mx-2 float-right"><FontAwesomeIcon icon={faCheck} /> Completed</button>
            <button type="button" className="btn btn-info mx-2 float-right"><FontAwesomeIcon icon={faCommentDots} /> Chat</button>
            <button type="button" className="btn btn-primary mx-2 float-right"><FontAwesomeIcon icon={faEye} /> View</button>
            </div>        
        </div>
        

    </div>

      <div className="card-footer text-center"><a href="/" className="btn btn-primary">Show More</a></div>
    </div>;
    }
  }
  export default TradePending;