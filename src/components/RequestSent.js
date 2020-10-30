import React from 'react';
import { Redirect } from "react-router-dom";


class RequestSent extends React.Component {
state={
    redirect:null
}
    componentDidMount() {
        setTimeout(() => this.setState({ redirect: "/trades" }), 2000)
      }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }
        return (
            <div className="container-fluid ">
                <h1 className="justify-content-center">Your Request has been Sent</h1>
                {this.props.location.state !== undefined ?
                <div>
                    Reference: {this.props.location.state.tradeId}
                </div> : null
                
                }
                
                <div>
                    <span>Look forward to your response! :) </span>
                </div>
            </div>
        )
    }
}
export default RequestSent;