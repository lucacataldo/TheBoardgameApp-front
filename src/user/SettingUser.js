import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

import { isAuthenticated } from "../auth";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import SettingSidebar from "./SettingSideBar";

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
  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .max(64, "Password must be under 64 characters.")
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least 1 uppercase alphabetical character"
    )
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least 1 lowercase alphabetical character"
    ),
  matchPassword: Yup.string()
    .when("password", {
      is: (password) => password !== undefined && password.length > 0,
      then: Yup.string().required("Please retype password"),
    })
    .oneOf([Yup.ref("password"), null], "password doesnt match"),
});

class SettingUser extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        matchPassword: "",
        about: "",
      },
      redirectToProfile: false,
      loading: false,
      alertStatus: "",
      alertMsg: "",
      alertVisible: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    getUser(userId, token).then((data) => {
      console.log(data);
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          user: {
            id: data._id,
            name: data.name,
            email: data.email,
            about: data.about,
            password: "",
            matchPassword: "",
          },
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    if (
      isAuthenticated().user._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToProfile: true });
    }
    this.init(userId);
  }

  userProfileForm = () => (
    <Formik
      enableReinitialize={true}
      initialValues={this.state.user}
      validationSchema={UserInfoValidation}
      onSubmit={(values, { setSubmitting }) => {
        this.setState({ loading: true });

        this.userData.append("name", values.name);
        this.userData.append("email", values.email);
        this.userData.append("about", values.about);
        if (values.password) {
          this.userData.append("password", values.password);
        }

        setTimeout(() => {
          const userId = this.props.match.params.userId;
          const token = isAuthenticated().token;

          updateUser(userId, token, this.userData).then((data) => {
            if (data.error) {
              this.setState({
                loading: false,
                alertStatus: "danger",
                alertMsg:
                  "Unable to update information. Please try again later.",
                alertVisible: true,
              });
            } else if (isAuthenticated().user.role === "admin") {
              this.setState({
                loading: false,
                alertStatus: "success",
                alertMsg: "User information updated.",
                alertVisible: true,
              });
            } else {
              updateLocalStorUser(data, () => {
                this.setState({
                  loading: false,
                  alertStatus: "success",
                  alertMsg: "User information updated.",
                  alertVisible: true,
                });
              });
            }
            setSubmitting(false);
          }, 2000);
        });
      }}
    >
      {({ touched, errors, isSubmitting }) => (
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
          <div className="row">
            <div className="col-md-12 my-2">
              <h4 className="text-muted">Change Password</h4>
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
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                className={
                  getIn(errors, "password") && getIn(touched, "password")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="password"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="text-muted col-3 col-form-label"
              htmlFor="matchPassword"
            >
              Confirm Password
            </label>
            <div className="col-9">
              <Field
                type="password"
                name="matchPassword"
                placeholder="Password"
                autoComplete="new-password"
                className={
                  getIn(errors, "matchPassword") &&
                  getIn(touched, "matchPassword")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="matchPassword"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row justify-content-md-end">
            <div className="col-md-3">
              <button
                type="submit"
                className="btn btn-success btn-block"
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
      alertVisible,
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
            spinner: (base) => ({
              ...base,
              width: "100px",
              "& svg circle": {
                stroke: "rgba(0,98,204,1)",
              },
            }),
            wrapper: {
              height: "100%",
            },
          }}
          text="Updating your profile...."
        >
          <div className="maxDivWidth container-fluid">
            <div className="row my-3">
              {/* SettingSidebar is col-sm-3 */}
              <SettingSidebar highlight="UserSetting" userId={id} />
              <div className="col-sm-9">
                <div className="card">
                  <div className="card-body text-dark">
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
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </>
    );
  }
}

export default SettingUser;
