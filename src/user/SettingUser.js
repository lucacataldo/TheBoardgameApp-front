import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

import { isAuthenticated } from "../auth";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import SettingContainer from "./SettingContainer";
import DefaultProfileImg from "../images/avatar.png";

import LoadingOverlay from "react-loading-overlay";
import Alert from "../components/Alert";

const UserInfoValidation = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must to be more than 1 characters.")
    .max(75, "Name must be under 75 characters.")
    .matches(/^([a-zA-Z ])+$/, "Name can only contain letters"),
  email: Yup.string()
    .email("Invalid email address format")
    .max(254, "Email must be under 254 characters.")
    .required("Email is required"),
 
    // .test(
    //   "fileSize",
    //   "File too large",
    //   value => value && value.size <= FILE_SIZE
    // )
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   value => value && SUPPORTED_FORMATS.includes(value.type)
    // )

  // password: Yup.string()
  //   .min(8, "Password must be 8 characters at minimum")
  //   .max(64, "Password must be under 64 characters.")
  //   .matches(
  //     /(?=.*[A-Z])/,
  //     "Password must contain at least 1 uppercase alphabetical character"
  //   )
  //   .matches(
  //     /(?=.*[a-z])/,
  //     "Password must contain at least 1 lowercase alphabetical character"
  //   )
  //   .required("Password is required"),
  // matchPassword: Yup.string()
  //   .oneOf([Yup.ref("password"), null], "password doesnt match")
  //   .required("Please retype password"),
});

class SettingProfile extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        about: ""
      },
      redirectToProfile: false,
      loading: false,
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
          user: {
            id: data._id,
            name: data.name,
            email: data.email,
            about: data.about
          },
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  userProfileForm = () => (
    <Formik
      enableReinitialize={true}
      initialValues={this.state.user}
      validationSchema={UserInfoValidation}
      onSubmit={(values, { setSubmitting }) => {
        this.userData.append("name", values.name);
        this.userData.append("email", values.email);
        this.userData.append("about", values.about);
        setTimeout(() => {
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
            setSubmitting(false);
          }, 2000);
        });
      }}
    >
      {({ values, touched, errors, isSubmitting, setFieldValue, setFieldError }) => (
        <Form>
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
              <Field
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="username"
                className={
                  getIn(errors, "name") && getIn(touched, "name")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="name"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="text-muted col-3 col-form-label" htmlFor="email">
              Email
            </label>
            <div className="col-9">
              <Field
                type="email"
                name="email"
                autoComplete="username"
                placeholder="Email"
                className={
                  getIn(errors, "email") && getIn(touched, "email")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="email"
                className="invalid-feedback"
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="text-muted col-3 col-form-label" htmlFor="about">
              About
            </label>
            <div className="col-9">
              <Field
                component="textarea"
                type="text"
                name="about"
                placeholder="Tell us something about you....."
                className={
                  getIn(errors, "about") && getIn(touched, "about")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="about"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="text-muted col-3 col-form-label"
              htmlFor="password"
            >
              Password
            </label>
            <div className="col-9">
              <Field
                type="password"
                name="user.password"
                placeholder="Password"
                autoComplete="new-password"
                className={
                  getIn(errors, "user.password") &&
                  getIn(touched, "user.password")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="user.password"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-3 col-9">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Submit"}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  render() {
    const {
      user: { id },
      redirectToProfile,
      loading,
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
          <SettingContainer sidebar="UserSetting" userId={id}>
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
                      this.userProfileForm()}
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
