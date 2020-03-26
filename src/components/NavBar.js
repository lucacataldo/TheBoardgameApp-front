import React from "react";
import { NavLink, withRouter } from "react-router-dom"; // withRouter to access history location-URL link
import { signout, isAuthenticated } from "../auth";
import BgLogo from "../images/BgLogo.png";


class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-icon-top navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/posts">
            <img src={BgLogo} width="20" height="20" alt="" /> Boardgame Guru
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#bgNavBar"
            aria-controls="bgNavBar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="bgNavBar">
            {isAuthenticated() && (
              <ul className="navbar-nav mr-auto">
                <li className="nav-item ">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to={`/user/${isAuthenticated().user._id}`}
                  >{`${isAuthenticated().user.name}'s Profile`}</NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to="/posts"
                  >
                    Posts
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to="/users"
                  >
                    Users
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to="/boardgames"
                  >
                    Collection
                  </NavLink>
                </li>
              </ul>
            )}

            <ul className="navbar-nav ">
              {!isAuthenticated() && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      activeClassName="selected"
                      to="/signin"
                    >
                      Sign In
                    </NavLink>
                  </li>
                  <li className="nav-item ">
                    <NavLink
                      className="nav-link"
                      activeClassName="selected"
                      to="/signup"
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
              {isAuthenticated() && (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link"
                      href="/#"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <div className=" profileInitalCircle text-center" style={{ fontSize: "32px"}}>
                        <strong>{`${isAuthenticated().user.name.substring(0, 1)}`}</strong>
                      </div>
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                    
                      {isAuthenticated() &&
                        isAuthenticated().user.role === "admin" && (
                          <>
                            <div className="dropdown-divider"></div>
                            <NavLink
                              className="dropdown-item"
                              activeClassName="selected"
                              to="/admin"
                            >
                              Admin
                            </NavLink>
                          </>
                        )}
                      <div className="dropdown-divider"></div>
                      <span
                        className="dropdown-item"
                        data-toggle="tooltip"
                        title="Sign Out"
                        aria-label="Sign Out"
                        onClick={() =>
                          signout(() => this.props.history.push("/"))
                        }
                        style={{ cursor: "pointer" }}
                      >
                        Sign Out
                      </span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
