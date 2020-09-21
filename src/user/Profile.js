import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import { getUser } from "./apiUser";
import { isAuthenticated } from "../auth";
import DefaultProfileImg from "../images/avatar.png";
import ProfileBanner from "../images/ProfileBG.jpeg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { getPostsByUserId } from "../post/apiPost";


class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: []
        };
    }


    initProfile = userId => {
        const token = isAuthenticated().token;
        getUser(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                let following = this.isFollowing(data);
                this.setState({ user: data, following });
                this.loadPosts(data._id);
            }
        });
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.initProfile(userId);
    };

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.initProfile(userId);
    };

    loadPosts = userId => {
        const token = isAuthenticated().token;
        getPostsByUserId(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    // check if user is in the follower's list
    isFollowing = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id;
        });
        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ user: data, following: !this.state.following });
            }
        });
    };


    render() {
        const { redirectToSignin, user, posts } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        // use new Date() to update image right away
        const photoUrl = user._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`
            : DefaultProfileImg;

        return (
            <div className="container">
                <div className=" pl-3 py-4 mt-3 bg-dark text-light" style={{backgroundImage: "url(" + ProfileBanner + ")", backgroundSize:"cover"}}><h3>Profile</h3></div>
                <div className="row mx-auto py-3 bg-white">
                    <div className="offset-2 col-md-3">
                        <img
                            style={{ height: "200px", width: "auto", borderRadius: "50%" }}
                            className="img-thumbnail shadow"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfileImg}`)}
                            alt={user.name}
                        />
                    </div>

                    <div className="col-md-6 text-dark">
                        <div className="lead mt-2">
                            <h2>{user.name}</h2>
                            <p>Email: {user.email}</p>
                            <p>{`Joined ${new Date(
                                user.createdDate
                            ).toDateString()}`}</p>
                        </div>

                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id ? (
                            <div className="d-inline-block">
                                <Link
                                    className="btn btn-raised btn-info mr-5"
                                    to={`/post/create`}
                                >
                                    Create Post
                                </Link>

                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ) : (
                            <FollowProfileButton
                                following={this.state.following}
                                onButtonClick={this.clickFollowButton}
                            />
                        )}

                        <div>
                            {isAuthenticated().user &&
                                isAuthenticated().user.role === "admin" && (
                                    <div className="card mt-5">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                Admin
                                            </h5>
                                            <p className="mb-2 text-danger">
                                                Edit/Delete as an Admin
                                            </p>
                                            <Link
                                                className="btn btn-raised btn-success mr-5"
                                                to={`/user/edit/${user._id}`}
                                            >
                                                Edit Profile
                                            </Link>
                                            <DeleteUser userId={user._id} />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 my-4 text-center">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />

                        <ProfileTabs
                            followers={user.followers}
                            following={user.following}
                            posts={posts}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
