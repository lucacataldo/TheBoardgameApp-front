import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { signup } from "../auth";
import Alert from "../components/Alert";
import SocialLogins from "./SocialLogins";
const SignupValidation = Yup.object().shape({
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
});
const SignUp = () => {
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);
  const [alertRedirect, setAlertRedirect] = useState("");

  
  return (
    <>
      <Alert
        type={alertStatus}
        message={alertMsg}
        visible={alertVisible}
        redirect={alertRedirect}
      />
      <div className="bgImage my-auto d-flex justify-content-center">
        <div className="my-auto col-lg-5 col-md-5 col-sm-12 signInOutDiv">
          <h2 className="text-center">Sign Up</h2>
          <SocialLogins title="Sign up" />
          <div className="or-seperator">
            <i>or</i>
          </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              matchPassword: ""
            }}
            validationSchema={SignupValidation}
            onSubmit={({ values, setSubmitting }) => {
              // signup(initialValues)
              //   .then(data => {
              //     if (data.error) {
              //       setAlertStatus("danger");
              //       setAlertMsg(data.error);
              //       setAlertVible(true);
              //     } else {
              //       setAlertStatus("info");
              //       setAlertMsg(data.error);
              //       setAlertVible(true);
              //       setAlertRedirect("/signin");
              //     }
              //   })
              //   .catch(err => {
              //     setAlertStatus("danger");
              //     setAlertMsg("Could not save data. Please try again later.");
              //     setAlertVible(true);
              //   });
              alert("Form is validated! Submitting the form...", values);
              setSubmitting(false);
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
                    type="name"
                    name="name"
                    placeholder="Name"
                    className={`form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="name"
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
                    name="email"
                    placeholder="Email"
                    className={`form-control ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
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
                    name="password"
                    placeholder="Password"
                    className={`form-control ${
                      touched.password && errors.password ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="password"
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
                    name="matchPassword"
                    placeholder="Retype Password"
                    className={`form-control ${
                      touched.matchPassword && errors.matchPassword
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="matchPassword"
                    className="invalid-feedback"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default SignUp;

