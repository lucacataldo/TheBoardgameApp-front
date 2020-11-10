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

    let group = document.querySelectorAll(`.btn-group[data-id='${listID}'] button`)

    group.forEach(el => {
      console.log(el);
      if (el.classList.contains("btn-primary")) {
        el.classList.replace("btn-primary", "btn-outline-primary")
      }
    })

    e.target.classList.replace("btn-outline-primary", "btn-primary")
  };

  onClickUpdate = (e) => {
    let data = this.state.userBoardgames;
    data.forEach(bg => {
      bg.condition = document.querySelector(`.btn-group[data-id='${bg._id}'] .btn-primary`).innerText;
      bg.price = 5;
    })
    console.log("DATA");
    console.log(data);
    updateUserBoardgames(this.state.userID, data).then(success => {
      document.getElementById("output").innerText = "saved"
      return success;
    });
  };

  badgeBgRender = (condition) => {
    switch (condition) {
      case "Excellent":
        return "badge-success"
      case "Good":
        return "badge-primary"
      case "Fair":
        return "badge-warning"
      case "Poor":
        return "badge-danger"
      default:
        break;
    }
  }

  renderCondition = (expected, condition) => {
    if (expected === condition) {
      return "btn-primary"
    } else {
      return "btn-outline-primary"
    }
  }

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
                  className="font-weight-bold d-flex justify-content-between align-items-center"
                  key={item.boardgame._id}
                  id={item.boardgame.id}
                >
                  <div>
                    <img
                      className="img-thumbnail listThumbnail"
                      src={item.boardgame.imgThumbnail}
                      alt="thumbnail"
                    />
                    <span>{item.boardgame.title}</span>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <div class="btn-group" data-id={item._id}>
                      <button
                        value="Excellent"
                        onClick={e => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition('Excellent', item.condition)} cursor-pointer`}
                      >
                        Excellent
                    	</button>
                      <button
                        value="Good"
                        onClick={e => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition('Good', item.condition)} cursor-pointer`}
                      >
                        Good
                    	</button>
                      <button
                        value="Fair"
                        onClick={e => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition('Fair', item.condition)} cursor-pointer`}
                      >
                        Fair
                    	</button>
                      <button
                        value="Poor"
                        onClick={e => {
                          this.onClickCondition(e, item._id);
                        }}
                        className={`btn ${this.renderCondition('Poor', item.condition)} cursor-pointer`}
                      >
                        Poor
                    	</button>
                    </div>

                  </div>

                </ListGroupItem>
              ))}
            </ListGroup>
            <button
              className="btn btn-success mt-2 float-right"
              onClick={e => {
                this.onClickUpdate(e)
              }}
            >
              Update
            </button>
            <div className="float-right mx-5" id="output"></div>
          </div>
        </div>
      </div>
    );
  }
}
export default TradeSettings;
