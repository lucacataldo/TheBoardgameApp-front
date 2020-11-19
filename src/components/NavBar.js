import React from "react";
import { NavLink, withRouter } from "react-router-dom"; // withRouter to access history location-URL link
import { signout, isAuthenticated } from "../auth";
import BgLogo from "../images/BgLogo.png";
//import Notification from "./notifications/Notification";
import { getEventsByUserId } from "../calendar/apiCalendar";
import { getAllTradeRequestsById } from "../trades/apiTrade";

class NavBar extends React.Component {
  // constructor() {
  //   super();
  //   // if (isAuthenticated().user) {
  //   //   this.state = {
  //   //     notifications: this.getNotifications()
  //   //   };
  //   // } else {
  //   //   this.state = {
  //   //     notifications: []
  //   //   };

  //   // }
  // }

  getNotifications = async () => {
    var notifications = [];
    await getEventsByUserId(isAuthenticated().user._id, isAuthenticated().token)
      .then((event) => {
        event.map((e) => {
          notifications.push({
            id: e._id,
            name: e.title,
            type: "Event",
            link: "/calendar/" + isAuthenticated().user._id,
            isRead: false,
          });
        });
      })
      .then(
        await getAllTradeRequestsById(isAuthenticated().user._id).then(
          (trade) => {
            trade.map((t) => {
              notifications.push({
                id: t._id,
                name: t.tradeReceiver.name,
                type: t.status.concat(" Trade"),
                link: "/trades",
                isRead: false,
              });
            });
            console.log(notifications);
          }
        )
      );
    return notifications;
  };

  render() {
    return (
      <nav className="navbar navbar-icon-top navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
        <div className="container-fluid">
          <NavLink
            className="navbar-brand"
            to={isAuthenticated() ? "/posts" : "/"}
          >
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
                {/* <li className="nav-item ">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to="/users"
                  >
                    Users
                  </NavLink>
                </li> */}
                <li className="nav-item dropdown ">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/#"
                    id="navbarDropdownCollectionLink"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Collection
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownCollectionLink"
                  >
                    <NavLink
                      className="dropdown-item"
                      activeClassName="selected"
                      to="/collection/bgguru"
                    >
                      Guru Collection
                    </NavLink>
                    <NavLink
                      className="dropdown-item"
                      activeClassName="selected"
                      to="/collection/bgg"
                    >
                      BGGeek Collection
                    </NavLink>
                  </div>
                </li>
                <li className="nav-item ">
                  <NavLink
                    className="nav-link"
                    activeClassName="selected"
                    to="/trades"
                  >
                    Trades
                  </NavLink>
                </li>
                <li className="nav-item ">
                  {isAuthenticated().user && (
                    <NavLink
                      className="nav-link"
                      activeClassName="selected"
                      to={`/calendar/${isAuthenticated().user._id}`}
                    >
                      Calendar
                    </NavLink>
                  )}
                </li>
              </ul>
            )}
            {/* {isAuthenticated().user && this.state.notifications && (
              <Notification notificationsObj={this.state.notifications} />
            )} */}
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
                      <div
                        className=" profileInitalCircle text-center"
                        style={{ fontSize: "32px" }}
                      >
                        <strong>{`${isAuthenticated().user.name.substring(
                          0,
                          1
                        )}`}</strong>
                      </div>
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      {isAuthenticated().user && (
                        <NavLink
                          className="dropdown-item"
                          activeClassName="selected"
                          to={`/user/edit/${isAuthenticated().user._id}`}
                        >
                          Settings
                        </NavLink>
                      )}
                      {isAuthenticated() &&
                        isAuthenticated().user.role === "admin" && (
                          <NavLink
                            className="dropdown-item"
                            activeClassName="selected"
                            to="/admin"
                          >
                            Admin
                          </NavLink>
                        )}
                      <div className="dropdown-divider"></div>
                      <span
                        className="dropdown-item"
                        data-toggle="tooltip"
                        title="Sign Out"
                        aria-label="Sign Out"
                        onClick={() =>
                          signout(() => window.location = "/")
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
