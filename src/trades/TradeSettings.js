import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Redirect } from "react-router-dom";
import {
  getGuruCollection,
  updateUserBoardgames,
} from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";
import Animator from "../animator/Animator";
import { ListGroup, ListGroupItem } from "reactstrap";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class TradeSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false,
      userID: null,
      userBoardgames: [],
      updateStatus: "idle",
    };
  }

  UNSAFE_componentWillMount() {
    var user = isAuthenticated().user.name;
    this.loadUserBoardgameData(user);
    this.setState({ userID: isAuthenticated().user._id });
  }

  async loadUserBoardgameData(user) {
    await getUserId(user)
      .then((id) => {
        getGuruCollection(id, isAuthenticated().token).then((bgList) => {
          let filteredBgList = bgList.filter((bg) => bg.forTrade === true);
          this.setState({ userBoardgames: filteredBgList, isLoading: false });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    } else {
      Animator.animate();
    }
  }

  onClickCondition = (e, listID) => {
    let group = document.querySelectorAll(
      `.btn-group[data-id='${listID}'] button`
    );

    group.forEach((el) => {
      console.log(el);
      if (el.classList.contains("btn-primary")) {
        el.classList.replace("btn-primary", "btn-outline-primary");
      }
    });

    e.target.classList.replace("btn-outline-primary", "btn-primary");
  };

  onClickUpdate = (e) => {
    let data = this.state.userBoardgames;
    data.forEach((bg) => {
      bg.condition = document.querySelector(
        `.btn-group[data-id='${bg._id}'] .btn-primary`
      ).innerText;
      bg.price = 5;
    });

    console.log("DATA");
    console.log(data);
    this.setState({
      updateStatus: "saving",
    });
    updateUserBoardgames(this.state.userID, data)
      .then((data) => {
        this.setState({
          updateStatus: "saved",
        });
        return data;
      })
      .catch((error) => {
        this.setState({
          updateStatus: "error",
        });
      });
  };

  badgeBgRender = (condition) => {
    switch (condition) {
      case "Excellent":
        return "badge-success";
      case "Good":
        return "badge-primary";
      case "Fair":
        return "badge-warning";
      case "Poor":
        return "badge-danger";
      default:
        break;
    }
  };

  renderCondition = (expected, condition) => {
    if (expected === condition) {
      return "btn-primary";
    } else {
      return "btn-outline-primary";
    }
  };

  addTag = (e, index) => {
    let tag = e.target.value;

    if (e.key === "Enter" && tag.trim().length > 0) {
      let copy = this.state.userBoardgames;
      copy[index].tags.push(tag);

      copy[index].tags = [...new Set(copy[index].tags)];
      this.setState({
        userBoardgames: copy,
      });
      e.target.value = "";
    }
  };

  deleteTag = (e, index, tagIndex) => {
    let copy = this.state.userBoardgames;
    copy[index].tags.splice(tagIndex, 1);
    this.setState({
      userBoardgames: copy,
    });
  };

  render() {
    const { redirectToHome } = this.state;
    if (redirectToHome) return <Redirect to="/" />;

    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar highlight="TradeSettings" />
          <div className="col-lg-6 animator">
            <h4>Trade Settings</h4>
            <ListGroup id="tradedToYou">
              {this.state.userBoardgames.map((item, index) => (
                <ListGroupItem
                  className="font-weight-bold d-flex flex-column flex-lg-row justify-content-between align-items-center"
                  key={item.boardgame._id}
                  id={item.boardgame.id}
                >
                  <div className="d-flex my-2 my-lg-0 flex-column flex-lg-row justify-content-center align-items-center">
                    <img
                      className="img-thumbnail listThumbnail"
                      src={item.boardgame.imgThumbnail}
                      alt="thumbnail"
                    />
                    <div>
                      {item.boardgame.title}
                      {item.tags.map((tag) => (
                        <span className="badge badge-info p-1 mx-1">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <span className="font-weight-normal">Condition: </span>
                    <div className="btn-group mx-3" data-id={item._id}>
                      <button
                        value="Excellent"
                        onClick={(e) => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition(
                          "Excellent",
                          item.condition
                        )} cursor-pointer`}
                      >
                        Excellent
                      </button>
                      <button
                        value="Good"
                        onClick={(e) => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition(
                          "Good",
                          item.condition
                        )} cursor-pointer`}
                      >
                        Good
                      </button>
                      <button
                        value="Fair"
                        onClick={(e) => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition(
                          "Fair",
                          item.condition
                        )} cursor-pointer`}
                      >
                        Fair
                      </button>
                      <button
                        value="Poor"
                        onClick={(e) => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition(
                          "Poor",
                          item.condition
                        )} cursor-pointer`}
                      >
                        Poor
                      </button>
                    </div>
                    <div className="dropdown">
                      <div
                        className="btn btn-outline-info"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-tags"></i> Tags
                      </div>
                      <div
                        className="dropdown-menu dropdown-menu-right p-3 shadow"
                        style={{ minWidth: "250px" }}
                      >
                        <h5 className="text-center">
                          Press 'Enter' to add tags
                        </h5>
                        <input
                          placeholder="Enter new tag"
                          className="form-control text-center"
                          type="text"
                          maxLength="25"
                          minLength="1"
                          onKeyUp={(e) => {
                            this.addTag(e, index);
                          }}
                        />

                        {item.tags.map((tag, tagIndex) => (
                          <div
                            className="dropdown-item text-center p-0 d-flex justify-content-between align-items-center"
                            onClick={(e) => {
                              this.deleteTag(e, index, tagIndex);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <span>{tag}</span>
                            <div className="p-2">
                              <i className="fa fa-minus-circle text-danger"></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            <button
              className="btn btn-success mt-2 float-right"
              onClick={(e) => {
                this.onClickUpdate(e);
              }}
            >
              Update
            </button>
            <div className="my-5 text-right">
              {this.state.updateStatus === "idle" && <span></span>}
              {this.state.updateStatus === "saving" && <span>Saving...</span>}
              {this.state.updateStatus === "saved" && (
                <span className="text-success">Saved!</span>
              )}
              {this.state.updateStatus === "error" && (
                <span className="text-danger">Error!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default TradeSettings;
