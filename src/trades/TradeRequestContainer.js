import React, {useEffect} from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import  BgListPrice from "../boardgame/BgListPrice";

class TradeRequestContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToHome: false
    };
  }

  componentDidMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }
  }

handleAddBoardgame(event){
var available = document.getElementById("availableList");
var tradeBox = document.getElementById("toBeTraded");
var val = available.options[available.selectedIndex].value;
var element = document.createElement('option');
element.appendChild(document.createTextNode(val));
tradeBox.appendChild(element);
available.removeChild(available.options[available.selectedIndex]);
console.log(val);
return true;
}


handleRemoveBoardgame(event){
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
            <div className="w-100 bg-white">
               <h4>Your Trade List Items</h4> 
            </div>
            <div className="row bg-white">
                <div className="col-md-5">
                    <h6 className="p-2 my-0">Available</h6>
                <br/>
                
                <div className="form-group">
                 <label >Select list:</label>
                    <BgListPrice />
                </div>

                </div>
                <div className="col-md-2">
                <input className="p-4" style={{marginTop:'100px'}} type="button" id="left" value="<" onClick={this.handleRemoveBoardgame}/>
                <br/>
                <input type="button" className="mt-10 p-4 mt-4" id="right" value=">" onClick={this.handleAddBoardgame}/>
                </div>
                <div className="col-md-5">

                <h6 className="p-2 my-0">To Trade </h6>
                <br/>
                
                <div className="form-group">
                 <label >Select list:</label>
                    <select multiple size="15" className="form-control h-100 w-100" id="toBeTraded">
                    </select>
                </div>
                </div>
            </div>
          
          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;