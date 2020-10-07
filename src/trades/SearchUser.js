
import React from "react";
import Button from "react-bootstrap/Button";

 class SearchUser extends React.Component {

    render() {

      return (
        <div>
        <input id='searchbar' className='w-25 mt-2 rounded' type='text' name='search' placeholder='Search...' value={this.props.searchValue} onChange={this.props.onChangeValue}/>
        <Button variant="primary" id="userInput">Search</Button></div>

      );
    }
  }
  export default SearchUser;