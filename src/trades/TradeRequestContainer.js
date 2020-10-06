import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import  BgListPrice from "../boardgame/BgListPrice";
import Button from "react-bootstrap/Button"
import { getUserId } from "../user/apiUser";
import {  getGuruCollection } from "../boardgame/apiBoardgame";



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
var available = document.getElementById("availableList");
var tradeBox = document.getElementById("toBeTraded");
var val = available.options[available.selectedIndex].value;
var id = available.options[available.selectedIndex].id;
var element = document.createElement('option');
element.setAttribute("id",id);
element.appendChild(document.createTextNode(val));
tradeBox.appendChild(element);
available.removeChild(available.options[available.selectedIndex]);
return true;
}


handleRemoveBoardgame(event){
var tradeBox = document.getElementById("toBeTraded");
var available = document.getElementById("availableList");
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
          <h4>Trade Information</h4>
  {/* START USER trade list */}
            <div className="row bg-white">
                <div className="col-md-5">
                    <h4 className="p-2 my-0">Your List</h4>
                <br/>
                
                <div className="form-group">
                    <label >Available:</label>
                    <BgListPrice bgData={this.state.userBoardgames}  />
                </div>

                </div>
                <div className="col-md-2">
                <input className="p-4" style={{marginTop:'100px'}} type="button" id="left" value="<" onClick={this.handleRemoveBoardgame}/>
                <br/>
                <input type="button" className="mt-10 p-4 mt-4" id="right" value=">" onClick={this.handleAddBoardgame}/>
                </div>
                <div className="col-md-5">

  
                
                <div className="form-group mt-6">
                 <label >To Trade:</label>
                    <select multiple size="15" className="form-control h-100 w-100" id="toBeTraded">
                    </select>
                </div>
                </div>
            </div>
{/* END USER trade list */}
          <hr/>
{/* START Recipient trade list */}

<div>
        <input id='searchbar' className='w-25 mt-2 rounded' type='text' name='search' placeholder='Search...' />
        <Button variant="primary" onClick={this.handleSearchButton.bind(this)}>Search</Button></div>
{this.state.foundUser ?

            <div className="row bg-white">
                <div className="col-md-5">
                  
                <h4 className="p-2 my-0">{this.state.searchUser}'s List</h4>
                <br/>
                
                <div className="form-group">
                 <label >Available:</label>
                    <BgListPrice bgData= {this.state.searchedUserBoardgames} />
                </div>

                </div>
                <div className="col-md-2">
                <input className="p-4" style={{marginTop:'100px'}} type="button" id="left" value="<" onClick={this.handleRemoveBoardgame}/>
                <br/>
                <input type="button" className="mt-10 p-4 mt-4" id="right" value=">" onClick={this.handleAddBoardgame}/>
                </div>
                <div className="col-md-5">
                
                <div className="form-group">
                 <label >To Trade:</label>
                    <select multiple size="15" className="form-control h-100 w-100" id="toBeTraded">
                    </select>
                </div>
                </div>
            </div>
            : <div className="row bg-white">
            <div className="col-md-5">
              <h3>Please search a username</h3>
              </div>
                </div>}
          {/* END Recipient trade list */}
          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;