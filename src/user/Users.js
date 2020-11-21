import React, { Component } from "react";
import { Link } from "react-router-dom";

import { getUsers } from "./apiUser";
import DefaultProfileImg from "../images/avatar.png";
import Animator from "../animator/Animator";
class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    getUsers().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
        Animator.animate();
      }
    });
  }

  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4 animator">
          <Link key={i} to={`/user/${user._id}`}>
            {user.photo ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                style={{ height: "225px", width: "225px" }}
                alt={user.name}
                className="img-thumbnail card-img-top postsImg mx-auto d-block"
              />
            ) : (
              <img
                className="img-thumbnail card-img-top postsImg mx-auto d-block"
                style={{ height: "225px", width: "225px" }}
                src={`${DefaultProfileImg}`}
                alt={user.name}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">{user.email}</p>
            </div>
          </Link>{" "}
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
