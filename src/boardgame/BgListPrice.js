import React from "react";
import { isAuthenticated } from "../auth";
import { getGuruCollection } from "../boardgame/apiBoardgame";

class BgListPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgData: [{}],
      user: ""   
  }
  }

    

  componentDidMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }
      this.setState({user: this.props.user});
      console.log("PROPS" + this.state.user);
     getGuruCollection(this.props.user).then(bgList => {
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
