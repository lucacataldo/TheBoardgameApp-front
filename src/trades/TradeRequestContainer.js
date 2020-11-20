import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import BgListPrice from "../boardgame/BgListPrice";
import Button from "react-bootstrap/Button";
import ConfirmRequestModal from "./modals/ConfirmRequestModal";
import { getUserId } from "../user/apiUser";
import {
  getGuruCollection,
  getAtlasBoardgameId
} from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faSearch,
  faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";
import {
  ListGroup,
  ListGroupItem,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  Alert
} from "reactstrap";
import { Link } from "react-router-dom";

class TradeRequestContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToHome: false,
      foundUser: false,
      selectGameAlert: false,
      selectGameMsg: "",
      isLoading: true,
      valueMin: 0,
      valueMax: 9999,
      userBoardgames: [],
      searchedUserBoardgames: [],
      price: 0,
      searchedUserPrice: 0,
      show: false,
      tradeData: {
        userID: "",
        userTradeList: [],
        userTotalPrice: 0,
        searchedUserID: "",
        searchedUser: "",
        searchedUserTotalPrice: 0,
        searchedUserTradeList: [],
        notes: ""
      }
    };
    this.baseTradeData = this.tradeData;
    this.baseState = this.state;
  }

  async loadUserBoardgameData(user) {
    await getUserId(user)
      .then(id => {
        getGuruCollection(id, isAuthenticated().token).then(bgList => {
          let filteredBgList = bgList.filter(bg => bg.forTrade === true);
          this.setState({ userBoardgames: filteredBgList, isLoading: false });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  showModal = e => {
    console.log(this.state.tradeData);
    this.setState({ show: !this.state.show });
  };

  loadSearchedUserBoardgameData(user) {
    //load logged in user's boardgames
    this.clear();
    this.loadUserBoardgameData(isAuthenticated().user.name);
    this.setState(prevState => ({
      tradeData: { ...prevState.tradeData, userID: isAuthenticated().user._id }
    }));

    getUserId(user)
      .then(id => {
        if (!id) {
          document.getElementById("searchbar").classList.add("is-invalid");
        } else {
          getGuruCollection(id, isAuthenticated().token).then(bgList => {
            // Filter currently not working, it should filter out identical games from both lists
            if (document.getElementById("filterMatching").checked === true) {
              console.log("CHECKED");
              console.log(bgList);
              bgList = bgList.filter(
                val => !this.state.userBoardgames.includes(val)
              );
              let userBoardgames = this.state.userBoardgames.filter(
                val => !bgList.includes(val)
              );
              let filteredBgList = userBoardgames.filter(
                bg => bg.forTrade === true
              );
              this.setState(prevState => ({
                tradeData: {
                  ...prevState.tradeData,
                  searchedUserID: id,
                  searchedUser: user
                },
                searchedUserBoardgames: filteredBgList,
                userBoardgames: userBoardgames,
                isLoading: false,
                foundUser: TextTrackCue
              }));
            } else {
              console.log("FILTER NOT CHECKED");
              try {
                let filteredBgList = bgList.filter(bg => bg.forTrade === true);
                this.setState(prevState => ({
                  tradeData: {
                    ...prevState.tradeData,
                    searchedUserID: id,
                    searchedUser: user
                  },
                  searchedUserBoardgames: filteredBgList,
                  isLoading: false,
                  foundUser: true
                }));
              } catch (e) {
                console.log(e);
              }
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleAddBoardgame(event) {
    if (event.currentTarget.id === "myList") {
      try {
        let available = document.getElementById("myList");
        let name = available.options[available.selectedIndex].value.split(
          " -- "
        );
        //using RegEx because trim is not working
        let condition = name[1];
        let MSRP = "";
        getAtlasBoardgameId(name[0])
          .then(boardgame => {
            MSRP = boardgame.games[0].msrp;
            var ID = available.options[available.selectedIndex].id;
            const values = {
              id: ID,
              name: name[0],
              price: MSRP,
              condition: condition
            };
            const trades = this.state.tradeData.userTradeList;
            const tradeItem = Object.create(values);
            trades.push(tradeItem);
            available.removeChild(available.options[available.selectedIndex]);

            let total =
              parseFloat(this.state.tradeData.userTotalPrice) +
              parseFloat(MSRP);
            this.setState(prevState => ({
              tradeData: {
                ...prevState.tradeData,
                userTradeList: trades,
                userTotalPrice: total.toFixed(2)
              }
            }));
          })
          .catch(err => {
            document
              .getElementById("searchedUserList")
              .classList.add("is-invalid");
            console.log(err);
          });

        /*Consider using this for state purposes...
        SOLUTION: make Database calls using ID to refill array with item.
         let bg = this.state.userBoardgames;
         bg = bg.filter((element) => element._id !== ID);
       this.setState({userBoardgames:bg, userTradeList: trades, userTotalPrice: total.toFixed(2) }); */

        return true;
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        let available = document.getElementById("searchedUserList");
        let name = available.options[available.selectedIndex].value.split(
          " -- "
        );
        //using RegEx because trim is not working
        let condition = name[1];
        let MSRP = "";
        getAtlasBoardgameId(name[0]).then(boardgame => {
          MSRP = boardgame.games[0].msrp;
          var ID = available.options[available.selectedIndex].id;
          const values = {
            id: ID,
            name: name[0],
            price: MSRP,
            condition: condition
          };
          const trades = this.state.tradeData.searchedUserTradeList;
          const tradeItem = Object.create(values);
          trades.push(tradeItem);
          available.removeChild(available.options[available.selectedIndex]);

          let total =
            parseFloat(this.state.tradeData.searchedUserTotalPrice) +
            parseFloat(MSRP);

          this.setState(prevState => ({
            tradeData: {
              ...prevState.tradeData,
              searchedUserTradeList: trades,
              searchedUserTotalPrice: total.toFixed(2)
            }
          }));
        });
        return true;
      } catch (e) {
        console.log(e);
      }
    }
  }
  handleRemoveBoardgame(event) {
    try {
      const trades = this.state.tradeData.userTradeList;

      const foundItem = trades.find(item => item.id === event.currentTarget.id);

      const removeItem = trades.filter(
        item => item.id !== event.currentTarget.id
      );
      var available = document.getElementById("myList");
      var element = document.createElement("option");
      element.setAttribute("id", foundItem.id);
      element.appendChild(
        document.createTextNode(foundItem.name + " -- " + foundItem.condition)
      );
      available.appendChild(element);

      let parsedPrice = foundItem.price;
      let total =
        parseFloat(this.state.tradeData.userTotalPrice) -
        parseFloat(parsedPrice);
      this.setState(prevState => ({
        tradeData: {
          ...prevState.tradeData,
          userTradeList: removeItem,
          userTotalPrice: total.toFixed(2)
        }
      }));
      return true;
    } catch (e) {
      console.log(e);
    }
  }
  handleRemoveUserBoardgame(event) {
    try {
      const trades = this.state.tradeData.searchedUserTradeList;
      const foundItem = trades.find(item => item.id === event.currentTarget.id);
      const removeItem = trades.filter(
        item => item.id !== event.currentTarget.id
      );
      console.log(foundItem);
      var available = document.getElementById("searchedUserList");
      var element = document.createElement("option");
      element.setAttribute("id", foundItem.id);
      element.appendChild(
        document.createTextNode(foundItem.name + " -- " + foundItem.condition)
      );
      available.appendChild(element);

      let parsedPrice = foundItem.price;
      let total =
        parseFloat(this.state.tradeData.searchedUserTotalPrice) -
        parseFloat(parsedPrice);
      this.setState(prevState => ({
        tradeData: {
          ...prevState.tradeData,
          searchedUserTradeList: removeItem,
          searchedUserTotalPrice: total.toFixed(2)
        }
      }));
      return true;
    } catch (e) {
      console.log(e);
    }
  }

  onChangeSearchBar = () => {
    document.getElementById("searchbar").classList.remove("is-invalid");
  };

  onChangeCondition = () => {
    document.getElementById("conditionSelect").classList.remove("is-invalid");
  };
  onChangeCondition2 = () => {
    document.getElementById("conditionSelect2").classList.remove("is-invalid");
  };
  handleSearchButton(event) {
    var inputValue = document.getElementById("searchbar").value;
    this.loadSearchedUserBoardgameData(inputValue);
  }

  //handles price change up till the decimal, extra validation toFixed(2) is used to round decimals to 2 digits.
  handlePriceChange(event) {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.setState({ price: value });
  }
  handleSearchedUserPriceChange(event) {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.setState({ searchedUserPrice: value });
  }

  clear = () => {
    this.setState(this.baseState);
    this.setState(prevState => ({
      tradeData: {
        ...prevState.tradeData,
        searchedUserTradeList: [],
        userTradeList: [],
        searchedUserTotalPrice: 0,
        userTotalPrice: 0
      }
    }));
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar />
          <div className="col-sm-9 col-md-9 col-lg-9">
            <div className="row">
              <div className="col-12 px-0">
                <h4>Make a Trade</h4>
              </div>

              <div className=" col-12 form-inline py-2 px-0">
                <FormGroup className="col-12">
                  <Input
                    id="searchbar"
                    onChange={this.onChangeSearchBar}
                    placeholder="Search..."
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      variant="primary"
                      className="rounded"
                      onClick={this.handleSearchButton.bind(this)}
                    >
                      <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </Button>
                  </InputGroupAddon>
                  &nbsp;
                  <Input
                    id="clear"
                    type="button"
                    className="btn btn-info rounded block"
                    onClick={this.clear.bind(this)}
                    value="Clear"
                  />
                  <div className="invalid-feedback">User does not exist.</div>
                </FormGroup>

                <FormGroup className="pl-4 pt-1">
                  <span>
                    <Label check>
                      <Input id="filterMatching" type="checkbox" />
                      Filter Matching Games *WIP
                    </Label>
                  </span>
                </FormGroup>
              </div>
            </div>
            {/* START Recipient trade list */}
            {!this.state.foundUser ? (
              <div className="row">
                <div className="col-6"></div>
              </div>
            ) : (
              <div>
                <div className="text-info">
                  ***Lists will only show games you have set to wantToTrade in
                  BoardgameGeek***
                </div>
                <div className="row bg-white">
                  {this.state.selectGameAlert ? (
                    <div className="col-12 px-0">
                      <Alert color="warning">{this.state.selectGameMsg}</Alert>
                    </div>
                  ) : null}

                  <div className="col-6">
                    <div className="col-12">
                      <h3>Your List ({this.state.userBoardgames.length})</h3>
                    </div>
                    <br />
                    <div className="col-12 form-group ">
                      <div className="form-group">
                        <BgListPrice
                          bgData={this.state.userBoardgames}
                          listID="myList"
                          addBoardgame={this.handleAddBoardgame.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>To Trade:</label>
                        <ListGroup id="tradedToYou">
                          {this.state.tradeData.userTradeList.map(item => (
                            <ListGroupItem
                              className="float-left font-weight-bold"
                              key={item.id}
                            >
                              <FontAwesomeIcon
                                id={item.id}
                                onClick={this.handleRemoveBoardgame.bind(this)}
                                className="align-middle cursor-pointer"
                                style={{ float: "left" }}
                                color="red"
                                size="lg"
                                icon={faMinus}
                              ></FontAwesomeIcon>
                              &nbsp;
                              {item.name.length < 40
                                ? item.name
                                : item.name.substring(0, 40) + "..."}{" "}
                              <h4 className="float-right">
                                MSRP:
                                {item.price === "0.00"
                                  ? "N/A"
                                  : "$" + item.price}
                              </h4>
                              <br />
                              {(function() {
                                switch (item.condition) {
                                  case "Excellent":
                                    return (
                                      <span className="badge badge-success float-left">
                                        {item.condition}
                                      </span>
                                    );
                                  case "Good":
                                    return (
                                      <span className="badge badge-primary float-left">
                                        {item.condition}
                                      </span>
                                    );
                                  case "Fair":
                                    return (
                                      <span className="badge badge-warning float-left">
                                        {item.condition}
                                      </span>
                                    );
                                  case "Poor":
                                    return (
                                      <span className="badge badge-danger float-left">
                                        {item.condition}
                                      </span>
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                        <h3 className="float-right">
                          Value: ${this.state.tradeData.userTotalPrice}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {this.state.searchedUserBoardgames.length > 0 ? (
                    <div className="col-6">
                      <Link to={`/user/${this.state.tradeData.searchedUserID}`}>
                        <h3>
                          {this.state.tradeData.searchedUser
                            .charAt(0)
                            .toUpperCase() +
                            this.state.tradeData.searchedUser.slice(1)}
                          's List ({this.state.searchedUserBoardgames.length})
                        </h3>
                      </Link>

                      <br />
                      <div className="col-12 form-group">
                        <BgListPrice
                          bgData={this.state.searchedUserBoardgames}
                          listID="searchedUserList"
                          addBoardgame={this.handleAddBoardgame.bind(this)}
                        />
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>To Trade:</label>
                          <ListGroup id="tradedToMe">
                            {this.state.tradeData.searchedUserTradeList.map(
                              item => (
                                <ListGroupItem
                                  key={item.id}
                                  className="align-middle font-weight-bold"
                                >
                                  <FontAwesomeIcon
                                    id={item.id}
                                    onClick={this.handleRemoveUserBoardgame.bind(
                                      this
                                    )}
                                    className="align-middle cursor-pointer"
                                    style={{ float: "left" }}
                                    color="red"
                                    size="lg"
                                    icon={faMinus}
                                  ></FontAwesomeIcon>
                                  &nbsp;
                                  {item.name.length < 40
                                    ? item.name
                                    : item.name.substring(0, 40) + "..."}
                                  <h4 className="float-right">
                                    MSRP:
                                    {item.price === "0.00"
                                      ? "N/A"
                                      : "$" + item.price}
                                  </h4>
                                  <br />
                                  {(function() {
                                    switch (item.condition) {
                                      case "Excellent":
                                        return (
                                          <span className="badge badge-success float-left">
                                            {item.condition}
                                          </span>
                                        );
                                      case "Good":
                                        return (
                                          <span className="badge badge-primary float-left">
                                            {item.condition}
                                          </span>
                                        );
                                      case "Fair":
                                        return (
                                          <span className="badge badge-warning float-left">
                                            {item.condition}
                                          </span>
                                        );
                                      case "Poor":
                                        return (
                                          <span className="badge badge-danger float-left">
                                            {item.condition}
                                          </span>
                                        );
                                      default:
                                        return null;
                                    }
                                  })()}
                                </ListGroupItem>
                              )
                            )}
                          </ListGroup>
                          <h3 className="float-right">
                            Value: $
                            {this.state.tradeData.searchedUserTotalPrice}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3>
                        <Link
                          to={`/user/${this.state.tradeData.searchedUserID}`}
                        >
                          {this.state.tradeData.searchedUser
                            .charAt(0)
                            .toUpperCase() +
                            this.state.tradeData.searchedUser.slice(1)}
                        </Link>{" "}
                        does not have any games for trade.
                      </h3>
                    </div>
                  )}
                </div>

                <div className="row bg-dark p-3">
                  <div className="offset-5">
                    <button
                      className="btn btn-success"
                      onClick={e => {
                        this.showModal();
                      }}
                    >
                      Review Trade
                      <br />
                      <FontAwesomeIcon
                        size="lg"
                        icon={faExchangeAlt}
                      ></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
                <ConfirmRequestModal
                  tradeData={this.state.tradeData}
                  onClose={this.showModal}
                  show={this.state.show}
                ></ConfirmRequestModal>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;
