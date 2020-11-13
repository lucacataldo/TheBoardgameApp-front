import React from "react";
import { isAuthenticated } from "../auth";
import {  getGuruCollection } from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";
import {Input} from 'reactstrap';


class BgListPrice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bgData: [{}],
      isLoading:true,
      search:null
  }  

  }
 
  async loadBoardgameData(user){
   await getUserId(user).then(id =>{
      console.log(id);
   getGuruCollection(id, isAuthenticated().token).then(bgList => {
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

    
  UNSAFE_componentWillMount() {
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

  searchSpace=(event)=>{
    let keyword = event.target.value;
    this.setState({search:keyword})
  }

  handleDoubleClick=(event)=>{
    this.props.addBoardgame(event);
console.log(event.target.value);
  }

  render() {
    const items = this.props.bgData.filter((data)=>{
      if(this.state.search == null)
          return data;
      else if(data.boardgame.title.toLowerCase().includes(this.state.search.toLowerCase())){
          return data;
      }
      return 0;
    })

   return(
/* <div class="card"  id={this.props.listID}>
  <ul className="list-group list-group-flush pagination">
  {this.props.bgData.map((bg,i)=>{
                return <li className="list-group-item bgListItem font-weight-bold" id={bg._id} key={bg._id}><img className="bgListImg" src={bg.boardgame.imgThumbnail} alt="pic" />{bg.boardgame.title}</li>
            })}

  </ul>
</div> */
<div>
  <Input type="search" id="searchList"onChange={(e)=>this.searchSpace(e)}></Input>

 <Input type="select" name="selectMulti"  multiple size="15" id={this.props.listID} onDoubleClick={(e)=>this.handleDoubleClick(e)} required>
   
           {items.map((bg,i)=>{
               return <option id={bg._id} key={bg._id}>{bg.boardgame.title} -- {bg.condition ? bg.condition : "N/A"}</option>
           })}
            </Input>

            <div className="invalid-feedback">Please select a game to trade.</div>
          </div>   
    );

      
  }
}
export default BgListPrice;
