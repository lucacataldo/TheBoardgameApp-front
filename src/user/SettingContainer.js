import React from "react";

import SettingSidebar from "./SettingSideBar";

class SettingContainer extends React.Component {
  render() {
    return (
      <div className="maxDivWidth container-fluid">
        <div className="row my-3">
          <SettingSidebar highlight={this.props.sidebar} userId={this.props.userId}/>
          <div className=" col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
export default SettingContainer;
