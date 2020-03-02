import React from "react";
import NavBar from "./components/NavBar";

class MainContainer extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <div className=" col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MainContainer;
