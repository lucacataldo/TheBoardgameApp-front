import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";
import { isAuthenticated } from "../auth";

import {
  getUser,
  updateBbgBoardgamesByUsername,
  updateLocalStorUser
} from "./apiUser";
import SettingContainer from "./SettingContainer";

import LoadingOverlay from "react-loading-overlay";
import Alert from "../components/Alert";

class SettingCollection extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: "",
        bbgUsername: ""
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
            bbgUsername: data.bbgUsername
          }
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  bbgForm = bbgUsername => (
    <Formik
      enableReinitialize={true}
      initialValues={this.state.user}
      validationSchema={Yup.object().shape({
        bbgUsername: Yup.string().required("Name is required")
      })}
      onSubmit={(values, { setSubmitting }) => {
        this.setState({ loading: true });
        this.userData.append("bbgUsername", values.bbgUsername);
        setTimeout(() => {
          const userId = this.props.match.params.userId;
          const token = isAuthenticated().token;
          
              updateBbgBoardgamesByUsername(
                userId,
                token,
                values.bbgUsername
              ).then(data => {
                if (data.error) {
                  this.setState({
                    alertStatus: "danger",
                    alertMsg:
                      "Unable to update information. Please try again later."
                  });
                } else if (isAuthenticated().user.role === "admin") {
                  this.setState({
                    alertStatus: "success",
                    alertMsg: "User information updated."
                  });
                } else {
                  updateLocalStorUser(data, () => {
                    this.setState({
                      alertStatus: "success",
                      alertMsg: "User information updated."
                    });
                  });
                }
              
            
            setSubmitting(false);
          }, 5000);
        });
      }}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form>
          <div className="form-group row">
            <label htmlFor="name" className="text-muted col-3 col-form-label">
              BBG UserName
            </label>
            <div className="col-9">
              <Field
                type="text"
                name="bbgUsername"
                placeholder="Boardgamegeek username"
                className={
                  getIn(errors, "bbgUsername") && getIn(touched, "bbgUsername")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="bbgUsername"
                className="invalid-feedback"
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-sm-3">
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
      id,
      bbgUsername,
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
          <SettingContainer sidebar="Boardgame" userId={id}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h2>Boardgamegeek Information</h2>
                    <hr />
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

export default SettingCollection;
