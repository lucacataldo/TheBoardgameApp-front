
import React, {Component} from "react";

 class SearchUser extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          search:''
      };
    }
  
    handleChange = (event) => {
        this.setState({
            search: event.target.value
        })

    }


    render() {

      return (
        
        <input id='searchbar' className='w-100 mt-2 rounded' type='text' name='search' placeholder='Search...' value={this.state.search} onChange={this.handleChange}/>



      );
    }
  }
  export default SearchUser;