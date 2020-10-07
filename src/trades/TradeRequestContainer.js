import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import  BgListPrice from "../boardgame/BgListPrice";
import Button from "react-bootstrap/Button"
import { getUserId } from "../user/apiUser";
import {  getGuruCollection } from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft,faArrowRight,faSearch, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";





class TradeRequestContainer extends React.Component {
  state = {
    redirectToHome: false,
    foundUser: false,
    isLoading: true,
    userBoardgames: [],
    searchedUserBoardgames: [],
    searchedUser:""
  }


componentWillMount(){
  var user = isAuthenticated().user.name;
  this.loadUserBoardgameData(user);

}

async loadUserBoardgameData(user){

  await getUserId(user).then(id =>{
     console.log(id);
  getGuruCollection(id).then(bgList => {
  this.setState({ userBoardgames: bgList, isLoading:false });
 })
   }).catch(err =>{
     console.log(err);
   })

 }

 loadSearchedUserBoardgameData(user){

  getUserId(user).then(id =>{
  getGuruCollection(id).then(bgList => {
    if(bgList !== undefined) 

    this.setState({ searchUser: user,searchedUserBoardgames: bgList, isLoading:false,foundUser:true });
 })
   }).catch(err =>{
     console.log(err);
   })

 }




handleAddBoardgame(event){

var available = document.getElementById("myList");
var tradeBox = document.getElementById("tradedToYou");
var price = document.getElementById("bgSetPrice");
var val = available.options[available.selectedIndex].value + " | $" + price.value;
var id = available.options[available.selectedIndex].id;
var element = document.createElement('option');
element.setAttribute("id",id);
element.appendChild(document.createTextNode(val));
tradeBox.appendChild(element);
available.removeChild(available.options[available.selectedIndex]);
return true;
}
handleRemoveBoardgame(event){
  var available = document.getElementById("myList");
  var tradeBox = document.getElementById("tradedToYou");
  var val = tradeBox.options[tradeBox.selectedIndex].value;
  var id = tradeBox.options[tradeBox.selectedIndex].id;
  var element = document.createElement('option');
  element.setAttribute("id",id);
  element.appendChild(document.createTextNode(val));
  available.appendChild(element);
  tradeBox.removeChild(tradeBox.options[tradeBox.selectedIndex]);
  return true;
  }

handleAddUserBoardgame(event){

  var available = document.getElementById("yourList");
  var tradeBox = document.getElementById("tradedToMe");
  var val = available.options[available.selectedIndex].value;
  var id = available.options[available.selectedIndex].id;
  var element = document.createElement('option');
  element.setAttribute("id",id);
  element.appendChild(document.createTextNode(val));
  tradeBox.appendChild(element);
  available.removeChild(available.options[available.selectedIndex]);
  return true;
  }
  handleRemoveUserBoardgame(event){
    var available = document.getElementById("yourList");
    var tradeBox = document.getElementById("tradedToMe");
    var val = tradeBox.options[tradeBox.selectedIndex].value;
    var id = tradeBox.options[tradeBox.selectedIndex].id;
    var element = document.createElement('option');
    element.setAttribute("id",id);
    element.appendChild(document.createTextNode(val));
    available.appendChild(element);
    tradeBox.removeChild(tradeBox.options[tradeBox.selectedIndex]);
    return true;
    }



// handleChangeValue = e => {

   
//    this.setState({searchValue: e.target.searchValue,
//                      foundUser:true});
  
  
//  };
 
 

handleSearchButton(event){
var inputValue = document.getElementById("searchbar").value;
console.log(inputValue);
this.loadSearchedUserBoardgameData(inputValue);

}





  render() { 
    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar
          />
          <div className="col-sm-6 col-lg-6">
          <div className="row">
            <div className="col-12 px-0"> <h4>Make a Trade</h4></div>
         
<div className=" col-8 form-inline py-2 px-0">
<input id='searchbar' className='w-25 h-100 mr-0 rounded form-control' type='text' name='search' placeholder='Search...' />
        <Button variant="primary" onClick={this.handleSearchButton.bind(this)}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></Button>  
</div>
</div>
        {/* START Recipient trade list */}
{this.state.foundUser ?

            <div className="row bg-white">   
                <div className="col-md-5">
                <h4>{this.state.searchUser}'s List</h4>
                
                <br/>
                
                <div className="form-group">
                 <label >Available:</label>
                    <BgListPrice bgData= {this.state.searchedUserBoardgames} listID="yourList" />
                </div>

                </div>
                <div className="justify-content-center text-center px-5">
                  <button className="p-4 mt-4" id="right2" style={{marginTop:'200px'}} value=">" onClick={this.handleAddUserBoardgame}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                  <br/>
                  <button className="p-4"  type="button" id="left2" value="<" onClick={this.handleRemoveUserBoardgame}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                
                
                </div>
                <div className="col-md-5">
                
                <div className="form-group mt-5">
                 <label >To Trade:</label>
                    <select multiple size="8" className="form-control h-100 w-100" id="tradedToMe">
                    </select>
                </div>
                </div>
            </div>  
        
            : <div className="row">
            <div className="col-md-5">
              {/* <h3>Please search a username</h3> */}
              </div>
                </div>}
          {/* END Recipient trade list */}
            {/* START USER trade list */}
            <div className="row bg-white">
                <div className="col-md-5 ">
                    <h4 className="p-2 my-0">Your List</h4>
                <br/>
                
                <div className="form-group">
                <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">$</div>
        </div>
        <input type="number" pattern="^\d+(?:\.\d{1,2})?$" step=".01" min="0" max="999" className="form-control" id="bgSetPrice" placeholder="Set Price" />
      </div>
                   <br/>
                    
                    <BgListPrice bgData={this.state.userBoardgames} listID="myList"  />
                </div>

                </div>
                <div className="justify-content-center text-center px-5">
           
                <button type="button" className=" p-4 center-block text-center"style={{marginTop:'200px'}} id="right1" value=">" onClick={this.handleAddBoardgame}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                <br/>          
                <button className="p-4 center-block"   id="left1" onClick={this.handleRemoveBoardgame}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                
                
                </div>
                <div className="col-md-5 mt-5">

  
                
                <div className="form-group mt-6">
                 <label >To Trade:</label>
                    <select multiple size="8" className="form-control h-100 w-100" id="tradedToYou">
                    </select>
      
                </div>
                </div>
            </div>
{/* END USER trade list */}
         
          </div> <button className="btn btn-success">Request Trade<br/><FontAwesomeIcon size="lg" icon={faExchangeAlt}></FontAwesomeIcon></button>
        </div>

         

        
      </div>
    );
  }
}
export default TradeRequestContainer;