import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import BgListPrice from "../boardgame/BgListPrice";
import Button from "react-bootstrap/Button";
import ConfirmRequestModal from "./ConfirmRequestModal";
import { getUserId } from "../user/apiUser";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSearch, faExchangeAlt, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ListGroup, ListGroupItem, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { createTrade } from "./apiTrade";





class TradeRequestContainer extends React.Component {
  state = {
    redirectToHome: false,
    foundUser: false, //true for testing
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

    getUserId(user).then(id => {
      getGuruCollection(id).then(bgList => {
        if (bgList !== undefined)
          if (document.getElementById("filterMatching").checked === true) {
            console.log("CHECKED")
            console.log(bgList);
            bgList = bgList.filter(val => !this.state.userBoardgames.includes(val));
            let userBoardgames = this.state.userBoardgames.filter(val => !bgList.includes(val));
            this.setState(prevState => ({
              tradeData: { ...prevState.tradeData, searchedUserID: id, searchedUser: user }, searchedUserBoardgames: bgList, userBoardgames: userBoardgames, isLoading: false, foundUser: true
            }));

          } else {
            console.log("FILTER NOT CHECKED");
            this.setState(prevState => ({
              tradeData: { ...prevState.tradeData, searchedUserID: id, searchedUser: user }, searchedUserBoardgames: bgList, isLoading: false, foundUser: true
            }));
          }

      })
    }).catch(err => {
      console.log(err);
    })

  }

  // submitTrade = event => {

  //   const token = isAuthenticated().token;
  //   createTrade(token, this.state.tradeData).then(data => {
  //     /*CREATE LOGIC FOR redirect after trade*/
  //   });

  // };

  handleAddBoardgame(event) {
    if (event.target.id === "right1") {
      try {
        let available = document.getElementById("myList");
        let price = document.getElementById("bgSetPrice");
        let condition = document.getElementById("conditionSelect2");
        var number = parseFloat(price.value).toFixed(2);
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

        return true;

      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        let available = document.getElementById("yourList");
        let price = document.getElementById("bgSetPrice2");
        let condition = document.getElementById("conditionSelect");
        let number = parseFloat(price.value).toFixed(2);
        let ID = available.options[available.selectedIndex].id;
        const values = { id: ID, name: available.options[available.selectedIndex].value, price: number, condition: condition.value }
        // values.name = (values.name.length > 30 ? values.name.substring(0,29)+"..." : values.name);

        const trades = this.state.tradeData.searchedUserTradeList;
        const tradeItem = Object.create(values);
        trades.push(tradeItem);
        available.removeChild(available.options[available.selectedIndex]);
        let total = parseFloat(this.state.tradeData.searchedUserTotalPrice) + parseFloat(number);

        this.setState(prevState => ({ tradeData: { ...prevState.tradeData, searchedUserTradeList: trades, searchedUserTotalPrice: total.toFixed(2) } }));
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

                <InputGroup>
                  <Input id='searchbar' placeholder="Search..." />
                  <InputGroupAddon addonType="append">
                    <Button variant="primary" onClick={this.handleSearchButton.bind(this)}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></Button>
                  </InputGroupAddon>
                </InputGroup>
                {/* <input id='searchbar' className='w-25 h-100 mr-0 rounded form-control' type='text' name='search' placeholder='Search...' />
                <Button variant="primary" onClick={this.handleSearchButton.bind(this)}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></Button> */}
                &nbsp;<span><FormGroup check>
                  <Label check>
                    <Input id="filterMatching" type="checkbox" />
                    Filter Matching Games
              </Label>
                </FormGroup></span>



              </div>

            </div>
            {/* START Recipient trade list */}
            {!this.state.foundUser ?

              <div className="row">
                <div className="col-md-5">
                </div>
              </div> :
              <div>
                <div className="row bg-white">
                  <div className="col-12">
                    <h4>{this.state.tradeData.searchedUser}'s List ({this.state.searchedUserBoardgames.length})</h4>
                  </div>
                  <br />

                  <div className=" col-4 form-group">

                    <div className="input-group">
                      <FormGroup row className="pl-3">
                        <Label for="bgSetPrice2">Set Price(${this.state.valueMin}-${this.state.valueMax})</Label>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                          <Input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handleSearchedUserPriceChange.bind(this)} placeholder="Set Price" id="bgSetPrice2" value={this.state.searchedUserPrice} />
                        </InputGroup>
                        {/* <input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handleSearchedUserPriceChange.bind(this)} className="form-control" id="bgSetPrice2" value={this.state.searchedUserPrice} placeholder="Set Price" /> */}
                        <Label for="conditionSelect">Condition</Label>
                        <Input type="select" name="select" id="conditionSelect">
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </Input>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="col-1"><FontAwesomeIcon className="btn-success mt-4 cursor-pointer" id="right2" onClick={this.handleAddBoardgame.bind(this)} icon={faPlusCircle} size="5x" color="green"></FontAwesomeIcon></div>
                  <FormGroup className="col-7">
                    <Label for="searchedUserNotes">Notes</Label>
                    <Input type="textarea" rows="5" name="searchedUserNotes" id="searchedUserNotes" />
                  </FormGroup>
                  <div className="col-5 pl-2 ml-2 mb-2">
                    <BgListPrice bgData={this.state.searchedUserBoardgames} listID="yourList" />
                  </div>
                  <div className="col-5">
                    <label >To Trade:</label>
                    <ListGroup id="tradedToMe">
                      {this.state.tradeData.searchedUserTradeList.map(item => <ListGroupItem key={item.id} id={item.id} className="align-middle" onClick={this.handleRemoveUserBoardgame.bind(this)}>
                        {item.name.length < 30 ?
                          item.name : item.name.substring(0, 30) + '...'} | ${item.price} | {item.condition}
                        <FontAwesomeIcon className="align-middle" style={{ float: "right" }} color="red" size="lg" icon={faMinusCircle} ></FontAwesomeIcon></ListGroupItem>)}
                    </ListGroup>
                    <h3>Total Value: ${this.state.tradeData.searchedUserTotalPrice}</h3>
                  </div>
                </div> 
                    <ConfirmRequestModal tradeData={this.state.tradeData} onClose={this.showModal} show={this.state.show} ></ConfirmRequestModal>  
                    
                {/* SPLIT TOP-BOTTOM BOXES */}
                <div className="row bg-dark p-3">

                  <div className="offset-5">
                    <button className="btn btn-success" onClick={e => {
              this.showModal();
         }}>Request Trade<br /><FontAwesomeIcon size="lg" icon={faExchangeAlt}></FontAwesomeIcon></button>
                    
              
                  </div>
                </div>
                <div className="row bg-white mt-3">

                  <div className="col-12">
                    <h4>Your List ({this.state.userBoardgames.length})</h4>
                  </div>
                  <div className="col-4 form-group ">
                    <div className="input-group">

                      <FormGroup row className="pl-3">
                        <Label for="bgSetPrice2">Set Price(${this.state.valueMin}-${this.state.valueMax})</Label>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                          <Input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handlePriceChange.bind(this)} placeholder="Set Price" id="bgSetPrice" value={this.state.price} />
                        </InputGroup>
                        <Label for="conditionSelect2">Condition</Label>
                        <Input type="select" name="select" id="conditionSelect2">
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </Input>
                      </FormGroup>

                      {/* <input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handlePriceChange.bind(this)} className="form-control" id="bgSetPrice" value={this.state.price} placeholder="Set Price" /> */}

                    </div>

                    <div className="form-group">
                      <BgListPrice bgData={this.state.userBoardgames} listID="myList" />
                    </div>

                  </div>
                  <div className="justify-content-center text-center px-5">

                    <button type="button" className=" p-4 center-block text-center" style={{ marginTop: '200px' }} id="right1" value=">" onClick={this.handleAddBoardgame.bind(this)}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>


                  </div>
                  <div className="col-md-5 mt-5">

                    <div className="form-group mt-6">
                      <label >To Trade:</label>
                      <ListGroup id="tradedToYou">
                        {this.state.tradeData.userTradeList.map(item => <ListGroupItem key={item.id} id={item.id} className="align-middle" onClick={this.handleRemoveBoardgame.bind(this)}>
                          {item.name.length < 30 ?
                            item.name : item.name.substring(0, 30) + '...'} | ${item.price} | {item.condition}
                          <FontAwesomeIcon className="align-middle" style={{ float: "right" }} color="red" size="lg" icon={faMinusCircle} ></FontAwesomeIcon></ListGroupItem>)}
                      </ListGroup>
                      <h3>Total Value: ${this.state.tradeData.userTotalPrice}</h3>
                    </div>
                  </div>
                </div>

              </div>
            }

          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;