import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import  BgListPrice from "../boardgame/BgListPrice";
import { getUser } from "../user/apiUser";

class TradeRequestContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToHome: false,
      guruName: ""
    }
  }

  componentDidMount(){
    getUser(isAuthenticated().user._id, isAuthenticated().token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      }
      else {
      this.setState({guruName: data.bggUsername})
    }
    
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
                    <BgListPrice user={this.state.guruName}  />
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
            <div className="row bg-white">
                <div className="col-md-5">
                <h4 className="p-2 my-0">Someone's List</h4>
                <br/>
                
                <div className="form-group">
                 <label >Available:</label>
                    <BgListPrice user= "ecargo"/>
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
          {/* END Recipient trade list */}
          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;