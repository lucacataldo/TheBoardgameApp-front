import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signup } from "../auth";
import SocialLogins from "./SocialLogins";
import Alert from "../components/Alert";
class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      matchPassword: "",
      alertStatus: "",
      alertMessage: "",
      alertVisible: false,
      alertSignupDone: false
    };
  }

  handleChange = name => event => {
    this.setState({
      alertVisible: false,
      alertSignupDone: false
    });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    const { name, email, password, matchPassword } = this.state;
    const user = {
      name,
      email,
      password,
      matchPassword
    };
    // console.log(user);
    signup(user)
      .then(data => {
        if (data.error) {
          this.setState({
            alertMessage: data.error,
            alertStatus: "danger",
            alertVisible: true
          });
        } else {
          this.setState({
            name: "",
            email: "",
            password: "",
            matchPassword: "",
            alertMessage: "",
            alertStatus: "info",
            alertSignupDone: true,
            alertVisible: false
          });
        }
      })
      .catch(err => {
        this.setState({
          alertMessage: "Could not save data. Please try again later.",
          alertStatus: "danger",
          alertVisible: true
        });
      });
  };

  signupForm = (name, email, password, matchPassword) => (
    <form>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span className="input-group-text">
            <i className="fa fa-user"></i>
          </span>
        </div>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          name="name"
          value={name}
          placeholder="Name"
          required="required"
        />
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span className="input-group-text">
            <i className="fa fa-envelope"></i>
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
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fa fa-lock"></i>
          </span>
          <input
            onChange={this.handleChange("matchPassword")}
            type="password"
            className="form-control"
            name="matchPassword"
            value={matchPassword}
            placeholder="Retype Password"
            required="required"
          />
        </div>
      </div>
      <button
        onClick={this.clickSubmit}
        className="btn btn-raised btn-primary btn-block"
      >
        Submit
      </button>
    </form>
  );

  render() {
    const {
      name,
      email,
      password,
      matchPassword,
      alertMessage,
      alertVisible,
      alertStatus,
      alertSignupDone
    } = this.state;
    return (
      <div className="bgImage mx-auto my-auto d-flex justify-content-center">
        <div className="mx-auto my-auto text-center col-lg-5 col-md-5 col-sm-12 signInOutDiv">
          <h2 className="text-center">Sign Up</h2>
          <SocialLogins title="Sign up" />
          <div class="or-seperator">
            <i>or</i>
          </div>
          {alertSignupDone && (
            <div className="alert alert-info">
              New account is successfully created. Please{" "}
              <Link to="/signin">Sign In</Link>.
            </div>
          )}
          <Alert type={alertStatus} message={alertMessage} visible={alertVisible} />
         
          {this.signupForm(name, email, password, matchPassword)}
        </div>
      </div>
    );
  }
}

export default Signup;
