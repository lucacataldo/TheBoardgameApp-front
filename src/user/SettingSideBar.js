import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import React from "react";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import DefaultProfileImg from "../images/avatar.png";

import Alert from "../components/Alert";

/* 
This sidebar is use for all Settings pages
Use this format to keep consistency

<div className="maxDivWidth container-fluid">
  <div className="row my-3">
    <SettingSidebar highlight="TitleToHighLight" />
    <div className="col-sm-9">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <h2>Main Heading</h2>
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
             any children html
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>; 
*/

class SettingSideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      loading: false,
      file: null,
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
          id: data._id,
          name: data.name,
          file: data._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                data._id
              }?${new Date().getTime()}`
            : DefaultProfileImg,
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    let userId = isAuthenticated().user._id;
    this.init(userId);
  }
  handleChange = (name) => (event) => {
    this.setState({ alertVisible: false });
    if (
      event.target.files[0] !== undefined &&
      event.target.files[0].size < 1000000
    ) {
      this.setState({ file: URL.createObjectURL(event.target.files[0]) });
      this.userData.set("photo", event.target.files[0]);
    } else {
      this.setState({
        alertMsg: "File size should be less than 1mb",
        alertStatus: "danger",
        alertVisible: true,
      });
    }
  };

  clickSubmitImg = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    const userId = this.props.userId;
    const token = isAuthenticated().token;

    updateUser(userId, token, this.userData).then((data) => {
      if (data.error) {
        this.setState({
          loading: false,
          alertStatus: "danger",
          alertMsg: data.error,
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
    });
  };

  render() {
    const { id, file, alertMsg, alertStatus, alertVisible } = this.state;
    return (
      <>
        <div
          className="modal fade"
          id="updateProfileImgModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="profileImgUploadModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="profileImgUploadModal">
                  Update Profile Image
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body py-0 px-0">
                <form>
                  <div className="col-12">
                    <Alert
                      type={alertStatus}
                      message={alertMsg}
                      visible={alertVisible}
                      className="mb-2"
                    />
                  </div>
                  <div className="row justify-content-center my-2">
                    <img
                      style={{ height: "150px", width: "auto" }}
                      className="img-thumbnail"
                      src={this.state.file}
                      onError={(i) => (i.target.src = `${DefaultProfileImg}`)}
                      alt={this.state.name}
                    />
                  </div>
                  <div className="row justify-content-center my-2">
                    <label
                      className="btn btn-info btn-rounded my-auto"
                      htmlFor="profileImg"
                    >
                      <span>Choose a photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        data-max-file-size="1M"
                        name="photo"
                        className="custom-file-input"
                        id="profileImg"
                        onChange={this.handleChange("photo")}
                        aria-describedby="profileImageUpload"
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </form>
              </div>
              <div className="modal-footer mt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={alertVisible && file !== null}
                  onClick={this.clickSubmitImg}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-3 " highlight={this.props.highlight}>
          <div className="text-center mb-4">
            <img
              style={{ maxHeight: "200px", maxWidth: "200px" }}
              className="avatar img-circle img-thumbnail rounded-circle"
              src={
                id
                  ? `${
                      process.env.REACT_APP_API_URL
                    }/user/photo/${id}?${new Date().getTime()}`
                  : DefaultProfileImg
              }
              onError={(i) => (i.target.src = `${DefaultProfileImg}`)}
              alt={this.state.name}
            />
            <button
              type="button"
              className="btn btn-outline-primary col-sm-8 my-2"
              data-toggle="modal"
              data-target="#updateProfileImgModal"
            >
              Update Photo
            </button>
          </div>

          <div className="list-group ">
            <span className="list-group-item list-group-item-dark font-weight-bold">
              Settings
            </span>
            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "UserSetting" ? "active" : ""
              }`}
              to={`/user/edit/${isAuthenticated().user._id}`}
            >
              User Setting <span className="sr-only">(current)</span>
            </Link>
            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "Boardgame" ? "active" : ""
              }`}
              to={`/user/edit/bgg/${isAuthenticated().user._id}`}
            >
              Boardgames
            </Link>
          </div>
        </div>
      </>
    );
  }
}
export default SettingSideBar;
