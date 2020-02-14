import React, { Component } from "react";
import { Link } from "react-router-dom";

import { getUsers } from "./apiUser";
import DefaultProfileImg from "../images/avatar.png";

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        getUsers().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        });
    }

    renderUsers = users => (
        <div className="row">
            {users.map((user, i) => (
            <Link to={`/user/${user._id}`} >
                <div className="card col-md-12" key={i}>
                    <div className="card-body">
                        <img
                            className="img-thunbnail card-img-top"
                            style={{height:"225px",width:"225px"}}
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                            onError={i => (i.target.src = `${DefaultProfileImg}`)}
                            alt={user.name}
                        />
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                    </div>
                </div>
            </Link>
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
