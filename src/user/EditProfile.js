import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import SettingContainer from "./SettingContainer";
import DefaultProfileImg from "../images/avatar.png";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      bbgUsername: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: ""
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
          about: data.about
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
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100kb" });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid Email is required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    // if its photo get the file, otherwise get the target value
    const value = name === "photo" ? event.target.files[0] : event.target.value;

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
          this.setState({ error: data.error });
        } else if (isAuthenticated().user.role === "admin") {
          this.setState({ redirectToProfile: true });
        } else {
          updateLocalStorUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  signupForm = (name, email, password, bbgUsername, about) => (
    <form>
      <div className="form-group row">
        <label htmlFor="photo" className="text-muted col-3 col-form-label">
          Profile Photo
        </label>
        <div className="col-9">
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                accept="image/*"
                data-max-file-size="1M"
                name="photo"
                className="custom-file-input"
                id="profileImgFile"
                onChange={this.handleChange("photo")}
                aria-describedby="profileImageUpload"
              />
              <label className="custom-file-label" htmlFor="profileImgFile">
                Choose file
              </label>
            </div>
          </div>
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
      //   error,
      //   loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfileImg;

    return (
      <SettingContainer sidebar="UserSetting">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <h2>Edit Profile</h2>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="offset-3 col-9 mb-2">
                <img
                  style={{ height: "200px", width: "auto" }}
                  className="img-thumbnail"
                  src={photoUrl}
                  onError={i => (i.target.src = `${DefaultProfileImg}`)}
                  alt={name}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {(isAuthenticated().user.role === "admin" ||
                  isAuthenticated().user._id === id) &&
                  this.signupForm(name, email, password, bbgUsername, about)}
              </div>
            </div>
          </div>
        </div>

        {/* <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )} */}
      </SettingContainer>
    );
  }
}

export default EditProfile;
