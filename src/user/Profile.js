import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { readUserAPI } from "./apiUser";
import { isAuthenticated } from "../auth";


class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
            redirectToSignin: false
        };
    }

    initProfile = userId => {
        const token = isAuthenticated().token;
        readUserAPI(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                this.setState({ user: data });
            }
        });
    };
    
    
    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.initProfile(userId);
    }

    render() {
        const redirectToSignin = this.state.redirectToSignin;
        if (redirectToSignin) return <Redirect to="/signin" />;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <p>Hello {isAuthenticated().user.name}</p>
                <p>Email: {isAuthenticated().user.email}</p>
                <p>{`Joined ${new Date(
                    this.state.user.createdDate
                ).toDateString()}`}</p>
            </div>
        );
    }
}

export default Profile;
