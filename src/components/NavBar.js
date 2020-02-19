import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom"; // withRouter to access history location-URL link
import { signout, isAuthenticated } from "../auth";
import BgLogo from "../images/BgLogo.png";

class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid ">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/"><img src={BgLogo} width="20" height="20" alt="" /> Boardgame Guru</Link>
                    </div>
                    {isAuthenticated() && (
                        <>
                            <div className="collapse navbar-collapse" >
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item mr-2"><NavLink className="nav-link" activeClassName="selected" to={`/user/${isAuthenticated().user._id}`}>{`${isAuthenticated().user.name}'s Profile`}</NavLink></li>
                                    <li className="nav-item mr-2"><NavLink className="nav-link" activeClassName="selected" to='/posts'>Posts</NavLink></li>
                                    <li className="nav-item mr-2"><NavLink className="nav-link" activeClassName="selected" to='/users'>Users</NavLink></li>
                                    
                                </ul>
                            </div>
                        </>
                    )}
                    <div className="nav navbar-right">
                        <ul className="navbar-nav mr-auto">
                            {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                                <li className="nav-item mr-2"><NavLink className="nav-link" activeClassName="selected" to='/admin'>Admin</NavLink></li>
                            )}
                            {!isAuthenticated() && (
                                <>
                                    <li className="nav-item mr-2"><NavLink className="nav-link" activeClassName="selected" to='/signin'>Sign In</NavLink></li>
                                    {/* <li className="nav-item mr-2"><NavLink className="nav-link d-none d-sm-block" activeClassName="selected" to='/signup'>Sign Up</NavLink></li> */}
                                </>
                            )}
                            {isAuthenticated() && (
                                <li className="nav-item mr-2"><span className="nav-link" onClick={() => signout(() => this.props.history.push("/"))} style={{ cursor: "pointer", color: "#fff" }}  ><i className= "fa fa-sign-out fa-lg"></i></span></li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);

