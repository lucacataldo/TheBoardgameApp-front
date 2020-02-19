import React, { useState } from "react";
import useForm from "./useForm";
import validation from "./validateLogin";
import { signup } from "../auth";
import Alert from "../components/Alert";
import SocialLogins from "./SocialLogins";
const SignUp = () => {
  const { handleChange, handleSubmit, handleBlur, values, errors } = useForm(
    submit,
    { name: "", password: "", matchPassword: "", email: "" },
    validation
  );
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);
  const [alertType, setAlertType] = useState("");

  function submit() {
    signup(values)
      .then(data => {
        if (data.error) {
          setAlertStatus("danger");
          setAlertMsg(data.error);
          setAlertVible(true);
        } else {
          setAlertStatus("info");
          setAlertMsg(data.error);
          setAlertVible(true);
          setAlertType("Redirect");
        }
      })
      .catch(err => {
        setAlertStatus("danger");
        setAlertMsg("Could not save data. Please try again later.");
        setAlertVible(true);
      });
  }

  return (
    <>
      <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
      <div className="bgImage my-auto d-flex justify-content-center">
        <div className="my-auto col-lg-5 col-md-5 col-sm-12 signInOutDiv">
          <h2 className="text-center">Sign Up</h2>
          <SocialLogins title="Sign up" />
          <div className="or-seperator">
            <i>or</i>
          </div>
         
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="input-group mb-3 ">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control"
                placeholder="Name"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-envelope"></i>
                </span>
              </div>
              <input
                className="form-control"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  className="form-control"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  className="form-control"
                  name="matchPassword"
                  type="password"
                  value={values.matchPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Retype Password"
                />
                {errors.matchPassword && (
                  <div className="invalid-feedback">{errors.matchPassword}</div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-raised btn-primary btn-block"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
