import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { signin, authenticate } from "../auth";
import SocialLogins from "./SocialLogins";
import Alert from "../components/Alert";

const SigninValidation = Yup.object().shape({
  user: Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address format"),
    password: Yup.string().required("Password is required")
  })
});

const Signin = props => {
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);
  const { history } = props;

  return (
    <>
      <div className="bgImage">
        <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
        <div className="h-100 my-auto d-flex justify-content-center">
          <div className="my-auto mx-3 col-lg-4 col-md-5 col-sm-11 signInOutDiv shadow">
            <h2 className="text-center font-weight-bold">Sign In</h2>
            <SocialLogins title="Sign in" />
            <div className="or-seperator">
              <i>or</i>
            </div>
            <Formik
              initialValues={{
                user: {
                  email: "",
                  password: ""
                }
              }}
              validationSchema={SigninValidation}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setAlertVible(false);
                setTimeout(() => {
                  signin(values.user)
                    .then(data => {
                      if (data.error) {
                        console.log("Here");
                        setAlertStatus("danger");
                        setAlertMsg(data.error);
                        setAlertVible(true);
                        resetForm({});
                      } else {
                        authenticate(data, () => {
                          history.push("/posts");
                        });
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
                      autoComplete="password"
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
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Please wait..." : "Sign In"}
                    </button>
                  </div>

                  <div className="form-group">
                    <Link to="/signup" className="pull-left text-primary ">
                      Register Now!
                    </Link>
                    <Link
                      to="/forgot-password"
                      className="pull-right text-primary"
                    >
                      Forgot Password?
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

export default Signin;
