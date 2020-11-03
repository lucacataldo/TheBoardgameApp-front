import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";
import { isAuthenticated } from "../auth";

import {
  getUser,
  updateBggBoardgamesByUsername,
  updateLocalStorUser,
} from "./apiUser";

import LoadingOverlay from "react-loading-overlay";
import Alert from "../components/Alert";
import SettingSidebar from "./SettingSideBar";

class SettingCollection extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: "",
        bggUsername: "",
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
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          user: {
            id: data._id,
            bggUsername: data.bggUsername == undefined ? "" : data.bggUsername,
          },
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  bggForm = (bggUsername) => (
    <Formik
      enableReinitialize={true}
      initialValues={this.state.user}
      validationSchema={Yup.object().shape({
        bggUsername: Yup.string().required("Name is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        this.setState({ loading: true });
        this.userData.append("bggUsername", values.bggUsername);
        setTimeout(() => {
          const userId = this.props.match.params.userId;
          const token = isAuthenticated().token;

          updateBggBoardgamesByUsername(userId, token, values.bggUsername).then(
            (data) => {
              if (data.error) {
                console.log(data.error);
                this.setState({
                  alertStatus: "danger",
                  alertMsg:
                    "Unable to update information. Please try again later.",
                });
              } else if (isAuthenticated().user.role === "admin") {
                this.setState({
                  alertStatus: "success",
                  alertMsg: "User information updated.",
                });
              } else {
                updateLocalStorUser(data, () => {
                  this.setState({
                    alertStatus: "success",
                    alertMsg: "User information updated.",
                  });
                });
              }

              this.setState({ loading: false, alertVisible: true });
              setSubmitting(false);
            },
            5000
          );
        });
      }}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form>
          <div className="form-group row">
            <label htmlFor="name" className="text-muted col-3 col-form-label">
              BGG UserName
            </label>
            <div className="col-9">
              <Field
                type="text"
                name="bggUsername"
                placeholder="Boardgamegeek username"
                className={
                  getIn(errors, "bggUsername") && getIn(touched, "bggUsername")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="bggUsername"
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
                {isSubmitting ? "Please wait..." : "Sync"}
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
      bggUsername,
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
              <SettingSidebar highlight="Boardgame" userId={id} />
              <div className="col-sm-9">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <h2>Boardgamegeek Information</h2>
                        <hr />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="lead">
                          <span className="font-weight-bold">Note: </span>{" "}
                          Syncing your Boardgamegeek collection will not remove
                          any boardgame from Boardgameguru. It will add any
                          boardgame(s) missing and update status from
                          boardgamegeek to boardgameguru.
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        {(isAuthenticated().user.role === "admin" ||
                          isAuthenticated().user._id === id) &&
                          this.bggForm(bggUsername)}
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

export default SettingCollection;
