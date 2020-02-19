import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form'

import { signin, authenticate } from "../auth";
import SocialLogins from "./SocialLogins";
import Alert from "../components/Alert";
class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
      alertStatus: "",
      alertMessage: "",
      alertVisible: false
    };
  }

  handleChange = name => event => {
    this.setState({ alertVisible: false });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };
    signin(user).then(data => {
      if (data.error) {
        this.setState({
          alertMessage: data.error,
          alertStatus: "danger",
          alertVisible: true,
          loading: false
        });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  signinForm = (email, password) => (
    <form>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span className="input-group-text">
            <i className="fa fa-user"></i>
          </span>
        </div>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          name="email"
          value={email}
          placeholder="Email"
          required="required"
        />
      </div>

      <div className="form-group">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fa fa-lock"></i>
          </span>
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            name="password"
            value={password}
            placeholder="Password"
            required="required"
          />
        </div>
      </div>

      <div className="clearfix">
        <button
          onClick={this.clickSubmit}
          type="submit"
          className="btn btn-success pull-left "
        >
          Sign in
        </button>
        <Link
          to="/forgot-password"
          className="pull-right text-primary fgotPass-text"
        >
          Forgot Password
        </Link>
      </div>
    </form>
  );

  render() {
    const {
      email,
      password,
      alertMessage,
      alertVisible,
      alertStatus,
      redirectToReferer,
      loading
    } = this.state;

    if (redirectToReferer) {
      return <Redirect to="/posts" />;
    }

    return (
      <div className="bgImage my-auto d-flex justify-content-center">
        <div className="my-auto text-center col-lg-5 col-md-5 col-sm-12 signInOutDiv">
          <Alert
            type={alertStatus}
            message={alertMessage}
            visible={alertVisible}
          />
          {loading ? (
            <div className="jumbotron text-center">
              <h2>Loading...</h2>
            </div>
          ) : (
            ""
          )}
          <h2 className="text-center">Sign In</h2>

          <SocialLogins title="Sign in" />

          <div class="or-seperator">
            <i>or</i>
          </div>

          {this.signinForm(email, password)}
          <hr />
          <div class="hint-text small">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary">
              Register Now!
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;
