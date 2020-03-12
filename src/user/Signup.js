import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

import { signup } from "../auth";
import Alert from "../components/Alert";
import SocialLogins from "./SocialLogins";

const SignupValidation = Yup.object().shape({
  user: Yup.object().shape({
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
      )
      .required("Password is required"),
    matchPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "password doesnt match")
      .required("Please retype password")
  })
});

const SignUp = () => {
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);
  const [alertRedirect, setAlertRedirect] = useState("");
  const [alertRedirectTxt, setAlertRedirectTxt] = useState("");
  return (
    <>
      <div className="bgImage">
        <Alert
          type={alertStatus}
          message={alertMsg}
          visible={alertVisible}
          redirectTo={alertRedirect}
          redirectTxt={alertRedirectTxt}
        />
        <div className="h-100 my-auto d-flex justify-content-center">
          <div className="my-auto mx-3 col-lg-4 col-md-5 col-sm-11 signInOutDiv">
            <h2 className="text-center">Sign Up</h2>
            <SocialLogins title="Sign up" />
            <div className="or-seperator">
              <i>or</i>
            </div>
            <Formik
              initialValues={{
                user: {
                  name: "",
                  email: "",
                  password: "",
                  matchPassword: ""
                }
              }}
              validationSchema={SignupValidation}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  signup(values.user)
                    .then(data => {
                      if (data.error) {
                        setAlertStatus("danger");
                        setAlertMsg(data.error);
                        setAlertVible(true);
                      } else {
                        setAlertStatus("success");
                        setAlertMsg("Account created sucessfully. Please ");
                        setAlertVible(true);
                        setAlertRedirect("/signin");
                        setAlertRedirectTxt("Sign In");
                      }
                    })
                    .catch(err => {
                      setAlertStatus("danger");
                      setAlertMsg(
                        "Could not save data. Please try again later."
                      );
                      setAlertVible(true);
                    });
                  setSubmitting(false);
                }, 2000);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <div className="input-group mb-3 ">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-user"></i>
                      </span>
                    </div>
                    <Field
                      type="text"
                      name="user.name"
                      placeholder="Name"
                      autoComplete="username"
                      className={
                        getIn(errors, "user.name") &&
                        getIn(touched, "user.name")
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    <ErrorMessage
                      component="div"
                      name="user.name"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                    <Field
                      type="email"
                      name="user.email"
                      autoComplete="username"
                      placeholder="Email"
                      className={
                        getIn(errors, "user.email") &&
                        getIn(touched, "user.email")
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    <ErrorMessage
                      component="div"
                      name="user.email"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-lock"></i>
                      </span>
                    </div>
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

                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-lock"></i>
                      </span>
                    </div>
                    <Field
                      type="password"
                      name="user.matchPassword"
                      placeholder="Retype Password"
                      autoComplete="new-password"
                      className={
                        getIn(errors, "user.matchPassword") &&
                        getIn(touched, "user.matchPassword")
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    <ErrorMessage
                      component="div"
                      name="user.matchPassword"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Please wait..." : "Submit"}
                    </button>
                  </div>
                  <div className="form-group text-center mb-0">
                    <span className="text-black-50">
                      Have an account? &nbsp;
                    </span>
                    <Link to="/signin" className="text-primary ">
                      Sign In
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
