import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Redirect } from "react-router-dom";
import {
  getGuruCollection,
  updateUserBoardgames
} from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";
import Animator from "../animator/Animator";
import { ListGroup, ListGroupItem } from "reactstrap";
class TradeSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false,
      userID: null,
      userBoardgames: []
    };
  }

  UNSAFE_componentWillMount() {
    var user = isAuthenticated().user.name;
    this.loadUserBoardgameData(user);
    this.setState({ userID: isAuthenticated().user._id });
  }

  async loadUserBoardgameData(user) {
    await getUserId(user)
      .then(id => {
        console.log(id);
        getGuruCollection(id).then(bgList => {
          console.log(bgList);
          let filteredBgList = bgList.filter(bg => bg.forTrade === true);
          this.setState({ userBoardgames: filteredBgList, isLoading: false });
        });
      })
      .catch(err => {
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
    let condition = e.target.value;
    let element = document.getElementById("conditionBadge-".concat(listID));

    switch (condition) {
      case "Excellent":
        element.innerText = condition;
        if (element.classList.contains("badge-primary"))
          element.classList.replace("badge-primary", "badge-success");
        else if (element.classList.contains("badge-warning"))
          element.classList.replace("badge-warning", "badge-success");
        else if (element.classList.contains("badge-danger"))
          element.classList.replace("badge-danger", "badge-success");
        else if (element.classList.contains("badge-info"))
          element.classList.replace("badge-info", "badge-success");
        break;
      case "Good":
        element.innerText = condition;
        if (element.classList.contains("badge-success"))
          element.classList.replace("badge-success", "badge-primary");
        else if (element.classList.contains("badge-warning"))
          element.classList.replace("badge-warning", "badge-primary");
        else if (element.classList.contains("badge-danger"))
          element.classList.replace("badge-danger", "badge-primary");
        else if (element.classList.contains("badge-info"))
          element.classList.replace("badge-info", "badge-primary");
        break;
      case "Fair":
        element.innerText = condition;
        if (element.classList.contains("badge-success"))
          element.classList.replace("badge-success", "badge-warning");
        else if (element.classList.contains("badge-primary"))
          element.classList.replace("badge-primary", "badge-warning");
        else if (element.classList.contains("badge-danger"))
          element.classList.replace("badge-danger", "badge-warning");
        else if (element.classList.contains("badge-info"))
          element.classList.replace("badge-info", "badge-warning");
        break;
      case "Poor":
        element.innerText = condition;
        if (element.classList.contains("badge-success"))
          element.classList.replace("badge-success", "badge-danger");
        else if (element.classList.contains("badge-primary"))
          element.classList.replace("badge-primary", "badge-danger");
        else if (element.classList.contains("badge-warning"))
          element.classList.replace("badge-warning", "badge-danger");
        else if (element.classList.contains("badge-info"))
          element.classList.replace("badge-info", "badge-danger");
        break;
      default:
        return "";
    }
  };

  onClickUpdate = () => {
    let data = this.state.userBoardgames;
    data.forEach(bg=>{
     bg.condition = document.getElementById("conditionBadge-".concat(bg._id)).innerText;
     bg.price = 5;
    })
    console.log("DATA");
    console.log(data);
    updateUserBoardgames(this.state.userID, data).then(success => {
      return success;
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
          <div className="col-sm-6 col-lg-6 animator">
            <h4>Trade Settings</h4>

            <ListGroup id="tradedToYou">
              {this.state.userBoardgames.map(item => (
                <ListGroupItem
                  className="float-left font-weight-bold"
                  key={item.boardgame._id}
                  id={item.boardgame.id}
                >
                  <img
                    className="img-thumbnail listThumbnail"
                    src={item.boardgame.imgThumbnail}
                    alt="thumbnail"
                  />
                  &nbsp;{item.boardgame.title}
                  <br />
                  {(function() {
                    switch (item.condition) {
                      case "Excellent":
                        return (
                          <span
                            id={"conditionBadge-" + item._id}
                            className="col-1 badge badge-success float-left"
                          >
                            {item.condition}
                          </span>
                        );
                      case "Good":
                        return (
                          <span
                            id={"conditionBadge-" + item._id}
                            className="col-1 badge badge-primary float-left"
                          >
                            {item.condition}
                          </span>
                        );
                      case "Fair":
                        return (
                          <span
                            id={"conditionBadge-" + item._id}
                            className="col-1 badge badge-warning float-left"
                          >
                            {item.condition}
                          </span>
                        );
                      case "Poor":
                        return (
                          <span
                            id={"conditionBadge-" + item._id}
                            className="col-1 badge badge-danger float-left"
                          >
                            {item.condition}
                          </span>
                        );
                      default:
                        return (
                          <span
                            id={"conditionBadge-" + item._id}
                            className="col-1 badge badge-info float-left"
                          >
                            Not set
                          </span>
                        );
                    }
                  })()}
                  <span className="float-left ml-5">Select:</span>
                  <div className="mt-2">
                    <button
                      value="Excellent"
                      onClick={e => {
                        this.onClickCondition(e, item._id);
                      }}
                      className="btn btn-success mx-1 float-left cursor-pointer"
                    >
                      Excellent
                    </button>
                    <button
                      value="Good"
                      onClick={e => {
                        this.onClickCondition(e, item._id);
                      }}
                      className="btn btn-primary mx-1 float-left cursor-pointer"
                    >
                      Good
                    </button>
                    <button
                      value="Fair"
                      onClick={e => {
                        this.onClickCondition(e, item._id);
                      }}
                      className="btn btn-warning mx-1 float-left cursor-pointer"
                    >
                      Fair
                    </button>
                    <button
                      value="Poor"
                      onClick={e => {
                        this.onClickCondition(e, item._id);
                      }}
                      className="btn btn-danger mx-1 float-left cursor-pointer"
                    >
                      Poor
                    </button>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            <button
              className="btn btn-secondary float-right"
              onClick={this.onClickUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default TradeSettings;
