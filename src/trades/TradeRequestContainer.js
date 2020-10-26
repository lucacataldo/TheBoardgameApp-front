import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import BgListPrice from "../boardgame/BgListPrice";
import Button from "react-bootstrap/Button";
import ConfirmRequestModal from "./ConfirmRequestModal";
import { getUserId } from "../user/apiUser";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faExchangeAlt, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ListGroup, ListGroupItem, FormGroup, Label, Input, InputGroup, InputGroupAddon, Alert } from 'reactstrap';
import { Link } from "react-router-dom";


class TradeRequestContainer extends React.Component {
  state = {
    redirectToHome: false,
    foundUser: false,
    selectGameAlert: false,
    selectGameMsg: '',
    isLoading: true,
    valueMin: 0,
    valueMax: 9999,
    userBoardgames: [],
    searchedUserBoardgames: [],
    price: 0,
    searchedUserPrice: 0,
    show: false,
    tradeData: {
      userID: '',
      userTradeList: [],
      userTotalPrice: 0,
      searchedUserID: '',
      searchedUser: "",
      searchedUserTotalPrice: 0,
      searchedUserTradeList: [],
      notes: ""
    }
  }



  //needs to be updated to new methdology
  UNSAFE_componentWillMount() {
    var user = isAuthenticated().user.name;
    this.loadUserBoardgameData(user);
    this.setState(prevState => ({
      tradeData: { ...prevState.tradeData, userID: isAuthenticated().user._id }
    }));

  }

  async loadUserBoardgameData(user) {

    await getUserId(user).then(id => {
      console.log(id);
      getGuruCollection(id).then(bgList => {
        this.setState({ userBoardgames: bgList, isLoading: false });
      })
    }).catch(err => {
      console.log(err);
    })
  }

  showModal = e => {
    this.setState({ show: !this.state.show });
  };

  loadSearchedUserBoardgameData(user) {

    getUserId(user).then((id) => {
      if (!id) {
        document.getElementById("searchbar").classList.add("is-invalid");

      } else {
        getGuruCollection(id).then(bgList => {
          if (bgList !== undefined)
            if (document.getElementById("filterMatching").checked === true) {
              console.log("CHECKED")
              console.log(bgList);
              bgList = bgList.filter(val => !this.state.userBoardgames.includes(val));
              let userBoardgames = this.state.userBoardgames.filter(val => !bgList.includes(val));
              this.setState(prevState => ({
                tradeData: { ...prevState.tradeData, searchedUserID: id, searchedUser: user }, searchedUserBoardgames: bgList, userBoardgames: userBoardgames, isLoading: false, foundUser: TextTrackCue
              }));

            } else {
              console.log("FILTER NOT CHECKED");
              try {
                this.setState(prevState => ({
                  tradeData: { ...prevState.tradeData, searchedUserID: id, searchedUser: user }, searchedUserBoardgames: bgList, isLoading: false, foundUser: true
                }));
              } catch (e) {
                console.log(e);
              }

            }

        })
      }


    }).catch(err => {
      console.log(err);
    })

  }

  handleAddBoardgame(event) {
    if (event.target.id === "right1") {
      try {
        let available = document.getElementById("myList");
        let price = document.getElementById("bgSetPrice");
        let condition = document.getElementById("conditionSelect2");
        var number = parseFloat(price.value).toFixed(2);

        if (available.options[available.selectedIndex] === undefined) {
          throw "Please select a game";
        }
        else if (condition.value === "") {
          throw "No condition was selected.";
        }
        var ID = available.options[available.selectedIndex].id;
        const values = { id: ID, name: available.options[available.selectedIndex].value, price: number, condition: condition.value }
        const trades = this.state.tradeData.userTradeList;
        const tradeItem = Object.create(values);
        trades.push(tradeItem);
        available.removeChild(available.options[available.selectedIndex]);


        let total = parseFloat(this.state.tradeData.userTotalPrice) + parseFloat(number);

        this.setState(prevState => ({
          tradeData: {
            ...prevState.tradeData,
            userTradeList: trades,
            userTotalPrice: total.toFixed(2)
          }
        }));
        /*Consider using this for state purposes...
        SOLUTION: make Database calls using ID to refill array with item.
         let bg = this.state.userBoardgames;
         bg = bg.filter((element) => element._id !== ID);
       this.setState({userBoardgames:bg, userTradeList: trades, userTotalPrice: total.toFixed(2) }); */

        document.getElementById("conditionSelect2").selectedIndex = 0;

        return true;

      } catch (e) {
        if (e === "Please select a game") {
          document.getElementById("myList").classList.add("is-invalid");
          window.setTimeout(() => { document.getElementById("myList").classList.remove("is-invalid"); }, 3000)

        }
        if (e === "No condition was selected.") {
          document.getElementById("conditionSelect2").classList.add("is-invalid");
        }

        this.setState({ selectGameAlert: true, selectGameMsg: e }, () => {
          window.setTimeout(() => { this.setState({ selectGameAlert: false }) }, 3000)
        });
        console.log(e);
      }
    } else {
      try {
        let available = document.getElementById("yourList");
        let price = document.getElementById("bgSetPrice2");
        let condition = document.getElementById("conditionSelect");

        if (available.options[available.selectedIndex] === undefined) {
          throw "Please select a game";
        }
        else if (condition.value === "") {
          throw "No condition was selected.";
        }
        let number = parseFloat(price.value).toFixed(2);
        let ID = available.options[available.selectedIndex].id;
        const values = { id: ID, name: available.options[available.selectedIndex].value, price: number, condition: condition.value }

        const trades = this.state.tradeData.searchedUserTradeList;
        const tradeItem = Object.create(values);
        trades.push(tradeItem);
        available.removeChild(available.options[available.selectedIndex]);
        let total = parseFloat(this.state.tradeData.searchedUserTotalPrice) + parseFloat(number);

        this.setState(prevState => ({ tradeData: { ...prevState.tradeData, searchedUserTradeList: trades, searchedUserTotalPrice: total.toFixed(2) } }));
        document.getElementById("conditionSelect").selectedIndex = 0;
        return true;

      } catch (e) {
        if (e === "Please select a game") {
          document.getElementById("yourList").classList.add("is-invalid");
          window.setTimeout(() => { document.getElementById("yourList").classList.remove("is-invalid"); }, 3000)

        }
        if (e === "No condition was selected.") {
          document.getElementById("conditionSelect").classList.add("is-invalid");

        }

        this.setState({ selectGameAlert: true, selectGameMsg: e }, () => {
          window.setTimeout(() => { this.setState({ selectGameAlert: false }) }, 3000)
        });
        console.log(e);
      }
    }



  }
  handleRemoveBoardgame(event) {
    try {
      const trades = this.state.tradeData.userTradeList;

      const foundItem = trades.find(item => item.id === event.currentTarget.id);

      const removeItem = trades.filter(item => item.id !== event.currentTarget.id);
      var available = document.getElementById("myList");
      var element = document.createElement('option');
      element.setAttribute("id", foundItem.id);
      element.appendChild(document.createTextNode(foundItem.name));
      available.appendChild(element);

      let parsedPrice = foundItem.price;
      let total = parseFloat(this.state.tradeData.userTotalPrice) - parseFloat(parsedPrice);
      this.setState(prevState => ({ tradeData: { ...prevState.tradeData, userTradeList: removeItem, userTotalPrice: total.toFixed(2) } }));
      return true;
    } catch (e) {
      console.log(e);
    }
  }
  handleRemoveUserBoardgame(event) {
    try {
      const trades = this.state.tradeData.searchedUserTradeList;
      const foundItem = trades.find(item => item.id === event.currentTarget.id);
      const removeItem = trades.filter(item => item.id !== event.currentTarget.id);
      console.log(foundItem);
      var available = document.getElementById("yourList");
      var element = document.createElement('option');
      element.setAttribute("id", foundItem.id);
      element.appendChild(document.createTextNode(foundItem.name));
      available.appendChild(element);

      let parsedPrice = foundItem.price;
      let total = parseFloat(this.state.tradeData.searchedUserTotalPrice) - parseFloat(parsedPrice);
      this.setState(prevState => ({ tradeData: { ...prevState.tradeData, searchedUserTradeList: removeItem, searchedUserTotalPrice: total.toFixed(2) } }));
      return true;
    } catch (e) {
      console.log(e);
    }
  }

  onChangeSearchBar = () => {
    document.getElementById("searchbar").classList.remove("is-invalid");
  }

  onChangeCondition = () => {

    document.getElementById("conditionSelect").classList.remove("is-invalid");
  }
  onChangeCondition2 = () => {

    document.getElementById("conditionSelect2").classList.remove("is-invalid");
  }
  handleSearchButton(event) {
    var inputValue = document.getElementById("searchbar").value;
    console.log(inputValue);
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
    this.setState(prevState => ({ tradeData: { ...prevState.tradeData, userTradeList: [], searchedUserTradeList: [] } }));
  }


  render() {
    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar
          />
          <div className="col-sm-9 col-md-9 col-lg-9">
            <div className="row">
              <div className="col-12 px-0">
                <h4>Make a Trade</h4>

              </div>

              <div className=" col-12 form-inline py-2 px-0">
                <FormGroup className="col-12">

                  <Input id='searchbar' onChange={this.onChangeSearchBar} placeholder="Search..." />

                  <InputGroupAddon addonType="append">
                    <Button variant="primary" className="rounded" onClick={this.handleSearchButton.bind(this)}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></Button>
                  </InputGroupAddon>
                  &nbsp;
                  <Input id="clear" type="button" className="btn btn-info rounded block" onClick={this.clear.bind(this)} value="Clear" />

                  <div className="invalid-feedback">
                    User does not exist.
                  </div>
                </FormGroup>

                <FormGroup className="pl-4 pt-1">

                  <span>

                    <Label check>
                      <Input id="filterMatching" type="checkbox" />
                      Filter Matching Games
              </Label>
                  </span>

                </FormGroup>


              </div>

            </div>
            {/* START Recipient trade list */}
            {!this.state.foundUser ?
              <div className="row">
                <div className="col-6">
                </div>
              </div> :
              <div>
                <div className="row bg-white">
                  {this.state.selectGameAlert ? <div className="col-12 px-0"><Alert color="warning" >{this.state.selectGameMsg}</Alert></div> : null}
         
                  <div className="col-6">

                    <div className="col-12">
                      <h3>Your List ({this.state.userBoardgames.length})</h3>
                    </div>
                    <br />
                    <div className="col-12 form-group ">
                      <div className="form-group">
                        <BgListPrice bgData={this.state.userBoardgames} listID="myList" />
                      </div>
                      <FormGroup row>

                        <div className="col">
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                            <Input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handlePriceChange.bind(this)} placeholder="Set Price" id="bgSetPrice" value={this.state.price} />
                          </InputGroup>
                        </div>

                        <div className="col">
                          <Input type="select" defaultValue={""} onChange={this.onChangeCondition2} name="select" id="conditionSelect2" required>
                            <option value="" disabled hidden>Boardgame Condition</option>
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Poor</option>
                          </Input>
                          <div className="invalid-feedback">
                            Please provide a valid Selection.
      </div>
                        </div>
                      </FormGroup>
                      <button className="btn btn-success col-12" id="right1" onClick={this.handleAddBoardgame.bind(this)}>Add Boardgame</button>



                    </div>
                    <div className="col-12">

                      <div className="form-group">
                        <label >To Trade:</label>
                        <ListGroup id="tradedToYou">
                          {this.state.tradeData.userTradeList.map(item => <ListGroupItem key={item.id} id={item.id} className="align-middle" onClick={this.handleRemoveBoardgame.bind(this)}>
                            {item.name.length < 30 ?
                              item.name : item.name.substring(0, 30) + '...'}  |  ${item.price}
                            <FontAwesomeIcon className="align-middle cursor-pointer" style={{ float: "right" }} color="red" size="lg" icon={faMinusCircle}></FontAwesomeIcon>
                            <br />
                            {(function () {
                              switch (item.condition) {
                                case 'Excellent':
                                  return <span className="badge badge-success float-left">{item.condition}</span>;
                                case 'Good':
                                  return <span className="badge badge-primary float-left">{item.condition}</span>;
                                case 'Fair':
                                  return <span className="badge badge-warning float-left">{item.condition}</span>;
                                case 'Poor':
                                  return <span className="badge badge-danger float-left">{item.condition}</span>;
                                default:
                                  return null;
                              }
                            })()}</ListGroupItem>)}
                        </ListGroup>
                        <h3>Total Value: ${this.state.tradeData.userTotalPrice}</h3>
                      </div>
                    </div>
                  </div>


                  <div className="col-6">
                    <Link to={`/user/${this.state.tradeData.searchedUserID}`}>
                      <h3>{this.state.tradeData.searchedUser.charAt(0).toUpperCase() + this.state.tradeData.searchedUser.slice(1)}'s List ({this.state.searchedUserBoardgames.length})</h3>
                    </Link>

                    <br />
                    <div className="col-12 ">
                      <BgListPrice bgData={this.state.searchedUserBoardgames} listID="yourList"  />
                      <FormGroup row className="pt-2">
                        <div className="col">
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                            <Input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handleSearchedUserPriceChange.bind(this)} placeholder="Set Price" id="bgSetPrice2" value={this.state.searchedUserPrice} />
                          </InputGroup>
                        </div>

                        <div className="col">

                          <Input type="select" defaultValue={""} onChange={this.onChangeCondition} name="select" id="conditionSelect" className="has-error" required>
                            <option value="" disabled hidden>Boardgame Condition</option>
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Poor</option>
                          </Input>
                          <div className="invalid-feedback">
                            Please provide a valid Selection.
      </div>
                        </div>
                      </FormGroup>
                      <button type="submit" className="btn btn-success col-12" id="right2" onClick={this.handleAddBoardgame.bind(this)}>Add Boardgame</button>

                    </div>


                    <div className="col-12">
                      <label >To Trade:</label>
                      <ListGroup id="tradedToMe">
                        {this.state.tradeData.searchedUserTradeList.map(item => <ListGroupItem key={item.id} id={item.id} className="align-middle font-weight-bold" onClick={this.handleRemoveUserBoardgame.bind(this)}>

                          {item.name.length < 30 ?
                            item.name : item.name.substring(0, 30) + '...'}  |  ${item.price}
                          <FontAwesomeIcon className="align-middle cursor-pointer" style={{ float: "right" }} color="red" size="lg" icon={faMinusCircle}></FontAwesomeIcon>
                          <br />
                          {(function () {
                            switch (item.condition) {
                              case 'Excellent':
                                return <span className="badge badge-success float-left">{item.condition}</span>;
                              case 'Good':
                                return <span className="badge badge-primary float-left">{item.condition}</span>;
                              case 'Fair':
                                return <span className="badge badge-warning float-left">{item.condition}</span>;
                              case 'Poor':
                                return <span className="badge badge-danger float-left">{item.condition}</span>;
                              default:
                                return null;
                            }
                          })()}

                        </ListGroupItem>)}
                      </ListGroup>
                      <h3>Total Value: ${this.state.tradeData.searchedUserTotalPrice}</h3>
                    </div>
                  </div>


                </div>
                <ConfirmRequestModal tradeData={this.state.tradeData} onClose={this.showModal} show={this.state.show} ></ConfirmRequestModal>


              </div>
            }
            <div className="row bg-dark p-3">

              <div className="offset-5">
                <button className="btn btn-success" onClick={e => {
                  this.showModal();
                }}>Review Trade<br /><FontAwesomeIcon size="lg" icon={faExchangeAlt}></FontAwesomeIcon></button>


              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;