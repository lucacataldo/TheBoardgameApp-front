import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import SettingContainer from "./SettingContainer";
import DefaultProfileImg from "../images/avatar.png";

import LoadingOverlay from "react-loading-overlay";
import Alert from "../components/Alert";

class SettingProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      bbgUsername: "",
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
      about: "",
      file: null,
      alertStatus: "",
      alertMsg: "",
      alertVisible: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    getUser(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          bbgUsername: data.bbgUsername,
          error: "",
          about: data.about,
          file: data._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                data._id
              }?${new Date().getTime()}`
            : DefaultProfileImg
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    this.setState({
      loading: false
    });
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({
        alertMsg: "File size should be less than 100kb",
        alertStatus: "danger",
        alertVisible:true
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({
        alertMsg: "Name is required",
        alertStatus: "danger",
        alertVisible:true
      });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        alertMsg: "A valid Email is required",
        alertStatus: "danger",
        alertVisible:true
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        alertMsg: "Password must be at least 6 characters long",
        alertStatus: "danger",
        alertVisible:true
      });
      return false;
    }
    

    return true;
  };

  handleChange = name => event => {
    this.setState({ alertVisible: false });
    // if its photo get the file, otherwise get the target value
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    if (name === "photo")
      this.setState({ file: URL.createObjectURL(event.target.files[0]) });
    const fileSize =
      name === "photo" && event.target.files[0].size > 0
        ? event.target.files[0].size
        : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      updateUser(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({
            loading: false,
            alertStatus: "danger",
            alertMsg: data.error,
            alertVisible: true
          });
        } else if (isAuthenticated().user.role === "admin") {
          this.setState({
            loading: false,
            alertStatus: "success",
            alertMsg: "User information updated.",
            alertVisible: true
          });
        } else {
          updateLocalStorUser(data, () => {
            this.setState({
              loading: false,
              alertStatus: "success",
              alertMsg: "User information updated.",
              alertVisible: true
            });
          });
        }
      });
    }
  };

  bbgForm = bbgUsername => (
    <form>
      <div className="form-group row">
        <label
          className="text-muted col-3 col-form-label"
          htmlFor="bbgUsername"
        >
          BBG Username
        </label>
        <div className="col-9">
          <input
            onChange={this.handleChange("bbgUsername")}
            type="text"
            className="form-control"
            value={bbgUsername}
            name="bbgUsername"
          />
        </div>
        <div className="form-group row">
          <div className="offset-3 col-9">
            <button
              onClick={this.clickSubmitBbgUser}
              className="btn btn-raised btn-primary "
            >
              {bbgUsername === "" ? "Add" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  signupForm = (name, email, password, about) => (
    <form>
      <div className="row">
        <div className="col-md-12 my-2">
          <h4 className="text-muted">Profile Photo</h4>
        </div>
      </div>
      <div className="form-group row align-items-center">
        <div className="col-3">
          <img
            style={{ height: "150px", width: "auto" }}
            className="img-thumbnail"
            src={this.state.file}
            onError={i => (i.target.src = `${DefaultProfileImg}`)}
            alt={name}
          />
        </div>
        <div className="col-9 d-inline">
          <label
            className="btn btn-info btn-rounded my-auto"
            htmlFor="profileImgFile"
          >
            <span>Upload a photo</span>
            <input
              type="file"
              accept="image/*"
              data-max-file-size="1M"
              name="photo"
              className="custom-file-input"
              id="profileImgFile"
              onChange={this.handleChange("photo")}
              aria-describedby="profileImageUpload"
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 my-2">
          <h4 className="text-muted">Personal Details</h4>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="name" className="text-muted col-3 col-form-label">
          Name
        </label>
        <div className="col-9">
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={name}
            name="name"
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="text-muted col-3 col-form-label" htmlFor="email">
          Email
        </label>
        <div className="col-9">
          <input
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
            name="email"
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="text-muted col-3 col-form-label" htmlFor="about">
          About
        </label>
        <div className="col-9">
          <textarea
            onChange={this.handleChange("about")}
            type="text"
            className="form-control"
            value={about}
            name="about"
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="text-muted col-3 col-form-label" htmlFor="password">
          Password
        </label>
        <div className="col-9">
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
            name="password"
          />{" "}
        </div>
      </div>
      <div className="form-group row">
        <div className="offset-3 col-9">
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary "
          >
            Update
          </button>
        </div>
      </div>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      bbgUsername,
      redirectToProfile,
      loading,
      about,
      alertMsg,
      alertStatus,
      alertVisible
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <>
        <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
        <LoadingOverlay
          active={loading}
          spinner
          styles={{
            spinner: base => ({
              ...base,
              width: "100px",
              "& svg circle": {
                stroke: "rgba(0,98,204,1)"
              }
            }),
            wrapper: {
              height: "100%"
            }
          }}
          text="Updating your profile...."
        >
          <SettingContainer sidebar="UserSetting">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h2>Basic Information</h2>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {(isAuthenticated().user.role === "admin" ||
                      isAuthenticated().user._id === id) &&
                      this.signupForm(name, email, password, about)}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {(isAuthenticated().user.role === "admin" ||
                      isAuthenticated().user._id === id) &&
                      this.bbgForm(bbgUsername)}
                  </div>
                </div>
              </div>
            </div>
          </SettingContainer>
        </LoadingOverlay>
      </>
    );
  }
}

export default SettingProfile;
