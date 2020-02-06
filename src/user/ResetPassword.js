import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { resetPasswordReq } from "../auth";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: ""
        };
    }

    clickResetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });

        resetPasswordReq({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };

    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Reset Your Password</h2>

                {this.state.message && (
                    <div className="alert alert-success" role="alert">Password is successfully changed. Please{" "}
                        <Link to="/signin">Sign In</Link>.</div>
                )}
                {this.state.error && (
                    <div className="alert alert-danger" role="alert">{this.state.error}</div>
                )}
                {!this.state.message && (
                    <form>
                        <div className="form-group mt-5">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Your new password"
                                value={this.state.newPassword}
                                name="newPassword"
                                onChange={e =>
                                    this.setState({
                                        newPassword: e.target.value,
                                        message: "",
                                        error: ""
                                    })
                                }
                                autoFocus
                            />
                        </div>
                        <button type="button" onClick={this.clickResetPassword} className="btn btn-raised btn-danger">
                            Reset Password
                    </button>
                    </form>
                )}
            </div>

        );
    }
}

export default ResetPassword;
