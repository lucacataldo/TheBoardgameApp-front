import React, { Component } from "react";
import { forgotPasswordReq } from "../auth";

class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    clickForgotPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPasswordReq(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };

    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Forgot Password?</h2>

                {this.state.message && (
                    <div className="alert alert-success" role="alert">{this.state.message}</div>
                )}
                {this.state.error && (
                    <div className="alert alert-danger" role="alert">{this.state.error}</div>
                )}

                <h6 className="mt-5 mb-5">Please enter your email and you will receive a link to create a new password via email. </h6>

                <form>
                    <div className="form-group mt-5">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Your email address"
                            value={this.state.email}
                            name="email"
                            onChange={e =>
                                this.setState({
                                    email: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <button onClick={this.clickForgotPassword} className="btn btn-raised btn-primary" >Reset Password  </button>
                </form>
            </div>
        );
    }
}

export default ForgotPassword;
