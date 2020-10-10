import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import BgListPrice from "../boardgame/BgListPrice";
import Button from "react-bootstrap/Button"
import { getUserId } from "../user/apiUser";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faSearch, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";





class TradeRequestContainer extends React.Component {
  state = {
    redirectToHome: false,
    foundUser: false,
    isLoading: true,
    userBoardgames: [],
    searchedUserBoardgames: [],
    searchedUser: "",
    price: 0,
    userTotalPrice: 0,
    searchedUserPrice: 0,
    searchedUserTotalPrice:0,
    valueMin: 0,
    valueMax: 9999
  }


  componentWillMount() {
    var user = isAuthenticated().user.name;
    this.loadUserBoardgameData(user);

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

  loadSearchedUserBoardgameData(user) {

    getUserId(user).then(id => {
      getGuruCollection(id).then(bgList => {
        if (bgList !== undefined)

          this.setState({ searchUser: user, searchedUserBoardgames: bgList, isLoading: false, foundUser: true });
      })
    }).catch(err => {
      console.log(err);
    })

  }




  handleAddBoardgame(event) {

    var available = document.getElementById("myList");
    var tradeBox = document.getElementById("tradedToYou");
    var price = document.getElementById("bgSetPrice");
    var number = parseFloat(price.value).toFixed(2);
    var val = available.options[available.selectedIndex].value + " | $" + number;
    var id = available.options[available.selectedIndex].id;
    var element = document.createElement('option');
    element.setAttribute("id", id);
    element.appendChild(document.createTextNode(val));
    tradeBox.appendChild(element);
    available.removeChild(available.options[available.selectedIndex]);
    let total = parseFloat(this.state.userTotalPrice) + parseFloat(number);

    this.setState({ userTotalPrice: total.toFixed(2) });
    return true;

  }
  handleRemoveBoardgame(event) {
    var available = document.getElementById("myList");
    var tradeBox = document.getElementById("tradedToYou");
    var val = tradeBox.options[tradeBox.selectedIndex].value.split("|");
    var id = tradeBox.options[tradeBox.selectedIndex].id;
    var element = document.createElement('option');
    element.setAttribute("id", id);
    element.appendChild(document.createTextNode(val[0]));
    available.appendChild(element);
    tradeBox.removeChild(tradeBox.options[tradeBox.selectedIndex]);
    let parsedPrice = val[1].split("$");
    let total = parseFloat(this.state.userTotalPrice) - parseFloat(parsedPrice[1]);
    this.setState({ userTotalPrice: total.toFixed(2) });
    return true;
  }

  handleAddUserBoardgame(event) {

    var available = document.getElementById("yourList");
    var tradeBox = document.getElementById("tradedToMe");
    var price = document.getElementById("bgSetPrice2");
    var number = parseFloat(price.value).toFixed(2);
    var val = available.options[available.selectedIndex].value + " | $" + number;
    var id = available.options[available.selectedIndex].id;
    var element = document.createElement('option');
    element.setAttribute("id", id);
    element.appendChild(document.createTextNode(val));
    tradeBox.appendChild(element);
    available.removeChild(available.options[available.selectedIndex]);
    let total = parseFloat(this.state.searchedUserTotalPrice) + parseFloat(number);

    this.setState({ searchedUserTotalPrice: total.toFixed(2) });
    return true;
  }
  handleRemoveUserBoardgame(event) {
    var available = document.getElementById("yourList");
    var tradeBox = document.getElementById("tradedToMe");
    var val = tradeBox.options[tradeBox.selectedIndex].value.split("|");
    var id = tradeBox.options[tradeBox.selectedIndex].id;
    var element = document.createElement('option');
    element.setAttribute("id", id);
    element.appendChild(document.createTextNode(val[0]));
    available.appendChild(element);
    tradeBox.removeChild(tradeBox.options[tradeBox.selectedIndex]);
    let parsedPrice = val[1].split("$");
    let total = parseFloat(this.state.searchedUserTotalPrice) - parseFloat(parsedPrice[1]);
    this.setState({ searchedUserTotalPrice: total.toFixed(2) });
    
    return true;
  }


  // handleChangeValue = e => {


  //    this.setState({searchValue: e.target.searchValue,
  //                      foundUser:true});


  //  };



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
                <input id='searchbar' className='w-25 h-100 mr-0 rounded form-control' type='text' name='search' placeholder='Search...' />
                <Button variant="primary" onClick={this.handleSearchButton.bind(this)}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></Button>
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
                  <h4>{this.state.searchUser}'s List</h4>
                </div>
                <br />

                <div className=" col-4 form-group">
                  <small>A value between {this.state.valueMin} & {this.state.valueMax}</small>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">$</div>
                    </div>

                    <input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handleSearchedUserPriceChange.bind(this)} className="form-control" id="bgSetPrice2" value={this.state.searchedUserPrice} placeholder="Set Price" />

                  </div>
                </div>
                <div className="col-8"></div>
                <div className="col-5 pl-2 ml-2 mb-2">
                  <label >Available:</label>
                  <BgListPrice bgData={this.state.searchedUserBoardgames} listID="yourList" />
                </div>

                <div className="col-1 justify-content-center">
                  <button className="p-4 mt-4" id="right2" style={{ marginTop: '200px' }} value=">" onClick={this.handleAddUserBoardgame.bind(this)}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                  <br />
                  <button className="p-4" type="button" id="left2" value="<" onClick={this.handleRemoveUserBoardgame.bind(this)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>

                </div>
                <div className="col-5">
                  <label >To Trade:</label>
                  <select multiple size="8" className="form-control " id="tradedToMe">
                  </select>
                  <h3>Total Value: ${this.state.searchedUserTotalPrice}</h3>
                </div>
              </div>
              {/* SPLIT TOP-BOTTOM BOXES */}
              <div className="row offset-5 mt-3">
                <button className="btn btn-success">Request Trade<br /><FontAwesomeIcon size="lg" icon={faExchangeAlt}></FontAwesomeIcon></button>
              </div>
              <div className="row bg-white mt-3">

              <div className="col-12">
                  <h4>Your List</h4>
                </div>
              <div className="col-md-5 ">

                <br />
                <small>A value between {this.state.valueMin} & {this.state.valueMax}</small>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">$</div>
                  </div>

                  <input type="number" step="0.01" max={this.state.valueMax} min={this.state.valueMin} onChange={this.handlePriceChange.bind(this)} className="form-control" id="bgSetPrice" value={this.state.price} placeholder="Set Price" />

                </div>

                <div className="form-group">
                  <BgListPrice bgData={this.state.userBoardgames} listID="myList" />
                </div>

              </div>
              <div className="justify-content-center text-center px-5">

                <button type="button" className=" p-4 center-block text-center" style={{ marginTop: '200px' }} id="right1" value=">" onClick={this.handleAddBoardgame.bind(this)}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                <br />
                <button className="p-4 center-block" id="left1" onClick={this.handleRemoveBoardgame.bind(this)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>

              </div>
              <div className="col-md-5 mt-5">

                <div className="form-group mt-6">
                  <label >To Trade:</label>
                  <select multiple size="8" className="form-control" id="tradedToYou">
                  </select>
                  <h3>Total Value: ${this.state.userTotalPrice}</h3>
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