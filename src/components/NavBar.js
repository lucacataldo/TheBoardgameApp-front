import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom"; // withRouter to access history location-URL link
import { signout, isAuthenticated } from "../auth";
import BgLogo from "../images/BgLogo.png";

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg  navbar-expand-md navbar-dark bg-dark">
        <div className="container-fluid ">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">
              <img src={BgLogo} width="20" height="20" alt="" /> Boardgame Guru
            </Link>
            <button
              className="navbar-toggler "
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          {isAuthenticated() && (
            <>
              <div className="collapse navbar-collapse" id="navbarNav">
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
                </ul>
              </div>
            </>
          )}
          <div className="nav navbar-right navbar-expand-md">
            <ul className="navbar-nav mr-auto">
              {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                <li className="nav-item mr-auto">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to="/admin"
                  >
                    Admin
                  </NavLink>
                </li>
              )}
              {!isAuthenticated() && (
                <>
                  <li className="nav-item mr-auto">
                    <NavLink
                      className="nav-link"
                      activeClassName="selected"
                      to="/signin"
                    >
                      Sign In
                    </NavLink>
                  </li>
                  <li className="nav-item mr-auto">
                    <NavLink
                      className="nav-link d-none d-sm-block"
                      activeClassName="selected"
                      to="/signup"
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
              {isAuthenticated() && (
                <li className="nav-item mr-auto">
                  <span
                    data-toggle="tooltip"
                    title="Sign Out"
                    aria-label="Sign Out"
                    className="nav-link "
                    onClick={() => signout(() => this.props.history.push("/"))}
                    style={{ cursor: "pointer", color: "#fff" }}
                  >
                    <i className="fa fa-sign-out fa-lg"></i>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
