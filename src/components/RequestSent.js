import React from 'react';
import { Redirect } from "react-router-dom";


class RequestSent extends React.Component {
state={
    redirect:null
}
    componentDidMount() {
        setTimeout(() => this.setState({ redirect: "/trades" }), 20000)
      }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }
        return (
            <div className="container-fluid overlay">
                <h1 className="page-header">Your Request has been Sent</h1>Reference: {this.props.location.state.tradeId}
                <div>
                    <span>Look forward to your response! :) </span>
                </div>
            </div>
        )
    }
}
export default RequestSent;