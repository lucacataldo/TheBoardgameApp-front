import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

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
      <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
      <div className="bgImage my-auto d-flex justify-content-center">
        <div className="my-auto col-lg-5 col-md-5 col-sm-12 signInOutDiv">
          <h2 className="text-center">Sign In</h2>
          <SocialLogins title="Sign In" />
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
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                signin(values.user)
                  .then(data => {
                    if (data.error) {
                      setAlertStatus("danger");
                      setAlertMsg(data.error);
                      setAlertVible(true);
                    } else {
                      authenticate(data, () => {
                        history.push("/posts");
                      });
                    }
                  })
                  .catch(err => {
                    setAlertStatus("danger");
                    setAlertMsg("Could not save data. Please try again later.");
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

export default Signin;

// class Signin extends Component {
//   constructor() {
//     super();
//     this.state = {
//       email: "",
//       password: "",
//       error: "",
//       redirectToReferer: false,
//       loading: false,
//       alertStatus: "",
//       alertMessage: "",
//       alertVisible: false
//     };
//   }

//   handleChange = name => event => {
//     this.setState({ alertVisible: false });
//     this.setState({ [name]: event.target.value });
//   };

//   clickSubmit = event => {
//     event.preventDefault();
//     this.setState({ loading: true });
//     const { email, password } = this.state;
//     const user = {
//       email,
//       password
//     };
//     signin(user).then(data => {
//       if (data.error) {
//         this.setState({
//           alertMessage: data.error,
//           alertStatus: "danger",
//           alertVisible: true,
//           loading: false
//         });
//       } else {
//         // authenticate
//         authenticate(data, () => {
//           this.setState({ redirectToReferer: true });
//         });
//       }
//     });
//   };

//   signinForm = (email, password) => (
//     <form>
//       <div className="input-group mb-3">
//         <div className="input-group-prepend">
//           <span className="input-group-text">
//             <i className="fa fa-user"></i>
//           </span>
//         </div>
//         <input
//           onChange={this.handleChange("email")}
//           type="email"
//           className="form-control"
//           name="email"
//           value={email}
//           placeholder="Email"
//           required="required"
//         />
//       </div>

//       <div className="form-group">
//         <div className="input-group">
//           <span className="input-group-text">
//             <i className="fa fa-lock"></i>
//           </span>
//           <input
//             onChange={this.handleChange("password")}
//             type="password"
//             className="form-control"
//             name="password"
//             value={password}
//             placeholder="Password"
//             required="required"
//           />
//         </div>
//       </div>

//       <div className="clearfix">
//         <button
//           onClick={this.clickSubmit}
//           type="submit"
//           className="btn btn-success pull-left "
//         >
//           Sign in
//         </button>
//         <Link
//           to="/forgot-password"
//           className="pull-right text-primary fgotPass-text"
//         >
//           Forgot Password
//         </Link>
//       </div>
//     </form>
//   );

//   render() {
//     const {
//       email,
//       password,
//       alertMessage,
//       alertVisible,
//       alertStatus,
//       redirectToReferer,
//       loading
//     } = this.state;

//     if (redirectToReferer) {
//       return <Redirect to="/posts" />;
//     }

//     return (
//       <div className="bgImage my-auto d-flex justify-content-center">
//         <div className="my-auto text-center col-lg-5 col-md-5 col-sm-12 signInOutDiv">
//           <Alert
//             type={alertStatus}
//             message={alertMessage}
//             visible={alertVisible}
//           />
//           {loading ? (
//             <div className="jumbotron text-center">
//               <h2>Loading...</h2>
//             </div>
//           ) : (
//             ""
//           )}
//           <h2 className="text-center">Sign In</h2>

//           <SocialLogins title="Sign in" />

//           <div className="or-seperator">
//             <i>or</i>
//           </div>

//           {this.signinForm(email, password)}
//           <hr />
//           <div className="hint-text small">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-primary">
//               Register Now!
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Signin;
