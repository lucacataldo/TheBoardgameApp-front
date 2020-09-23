import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import React from "react";

import { getUser } from "../user/apiUser";

class BgSideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      loading: false,
      file: null
    };
  }
  init = userId => {
    const token = isAuthenticated().token;
    getUser(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          name: data.name
        });
      }
    });
  };

  componentDidMount() {
    let userId = isAuthenticated().user._id;
    this.init(userId);
  }

  render() {
    return (
      <>
        <div
          className="col-sm-3 col-lg-2 maxSidebarWidth ml-3 justify-content-right mt-5"
          highlight={this.props.highlight}
        >
          <div className="list-group ">
            <span className="list-group-item list-group-item-dark font-weight-bold">
              Collections
            </span>
            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "UserCollection" ? "active" : ""
              }`}
              to={`/collection/bgguru`}
            >
              Guru Collection <span className="sr-only">(current)</span>
            </Link>
            <Link
              className={`list-group-item list-group-item-action ${
                this.props.highlight === "BggCollection" ? "active" : ""
              }`}
              to={`/collection/bgg`}
            >
              BGG Collection
            </Link>
          </div>
        </div>
      </>
    );
  }
}
export default BgSideBar;
