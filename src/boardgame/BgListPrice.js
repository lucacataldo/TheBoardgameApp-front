import React from "react";
import { isAuthenticated } from "../auth";
import { getGuruCollection } from "../boardgame/apiBoardgame";

class BgListPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {bgData: [{}]}
  }

    

  componentDidMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }
    getGuruCollection("ZennaL").then(data => {
    this.setState({ bgData: data });
})

  }

//   getUser(isAuthenticated().user._id, token).then(data => {
//     if (data.error === undefined && data.bggUsername) {
//       setUsername(data.bggUsername);
//       getBGCollection(data.bggUsername).then(bggdata => {
//         if (bggdata !== undefined && !bggdata.error) {
//           setData(bggdata);
//         }
//       });
//     }
//   });




  render() {
        const dataList = this.state.bgData;
    return (
        <select multiple size="15" className="form-control h-100" id="availableList">
           {dataList.map((bg,i)=>{
               return <option id={i}>{bg.title}</option>
           })}
            
       </select>
    );
  }
}
export default BgListPrice;
