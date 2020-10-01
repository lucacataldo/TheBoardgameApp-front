import React from "react";
import { isAuthenticated } from "../auth";
import {  getGuruCollection } from "../boardgame/apiBoardgame";


class BgListPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgData: [{}],
      user: ""   
  }
  }

    

  componentWillMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }
      console.log("ISAUTHENTICATED" + Object.keys(isAuthenticated().user));
      console.log("PROPS" + this.props);
      let user = "";
      if(this.props.user === "" || this.props.user === undefined){
        console.log("UNDEFINED block");
        user = isAuthenticated().user.name;
      }else{
        user = this.props.user
      }
      
     getGuruCollection(user).then(bgList => {
    this.setState({ bgData: bgList });
    })


  }


  render() {
 
    return (
        <select multiple size="15" className="form-control h-100" id="availableList">
           {this.state.bgData.map((bg,i)=>{
               return <option id={bg.bggId}>{bg.title}</option>
           })}
            
       </select>
    );
  }
}
export default BgListPrice;
