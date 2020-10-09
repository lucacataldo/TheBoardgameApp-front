import React from "react";
import { isAuthenticated } from "../auth";
import {  getGuruCollection } from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";


class BgListPrice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bgData: [{}],
      isLoading:true
  }  

  }
 
  async loadBoardgameData(user){
   await getUserId(user).then(id =>{
      console.log(id);
   getGuruCollection(id).then(bgList => {
     this.state.bgData = bgList;

        //  bgList.map(function(item,i){
        //     array.push(item.boardgame.title);
        //  })

   this.setState({ bgData: bgList, isLoading:false });
  })
    }).catch(err =>{
      console.log(err);
    })

  }

    
  componentWillMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }

      let user = "";
      if(this.props.user === "" || this.props.user === undefined){
        user = isAuthenticated().user.name;
      }else{
        user = this.props.user
      }
      this.loadBoardgameData(user);



     


  }


  render() {
  return(<select multiple size="15" className="form-control" id={this.props.listID}>

           {this.props.bgData.map((bg,i)=>{
               return <option key={bg._id}>{bg.boardgame.title}</option>
           })}
            
       </select>
    );

       
  }
}
export default BgListPrice;
