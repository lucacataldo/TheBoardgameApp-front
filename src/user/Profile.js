import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { getUser } from "./apiUser";
import { isAuthenticated } from "../auth";
import DefaultProfileImg from "../images/avatar.png";
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
                <div className="row">
                    <div className="col-lg-4">
                        <div className="row mt-5 justify-content-center">
                            <img
                                style={{ height: "200px", width: "auto", borderRadius: "50%" }}
                                src={photoUrl}
                                onError={i => (i.target.src = `${DefaultProfileImg}`)}
                                alt={user.name}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <h1 className="mt-3 text-center">{user.name}</h1>
                        </div>
                        <div className="row justify-content-center">
                            <p>
                                {`Member Since: ${new Date(user.createdDate).toDateString()}`}
                            </p>
                        </div>
                        <div className="row justify-content-center">
                            <p> <i className="fa fa-envelope"></i> {user.email}</p>
                        </div>
                        {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ? (
                                <div className="d-flex flex-column mx-5">
                                    <Link
                                        className="btn btn-success"
                                        to={`/post/create`}
                                    >
                                        Create Post
                                    </Link>
                                    <Link
                                        className="btn btn-info my-1"
                                        to={`/user/edit/${user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ) : (
                                <div className="d-flex flex-column mx-5">
                                    <FollowProfileButton
                                        following={this.state.following}
                                        onButtonClick={this.clickFollowButton}
                                    />
                                </div>
                                
                            )}
                    </div>
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col md-12 my-4 text-center">
                                <ProfileTabs
                                    followers={user.followers}
                                    following={user.following}
                                    posts={posts}
                                />

                                {user.about ? (
                                    <div>
                                        <hr/>
                                        <h4>About</h4>
                                        <p className="lead">
                                            {user.about}
                                        </p>
                                    </div>
                                ) : (<span></span>)}
                               
                            </div>
                        </div>
                        <div className="row py-3 d-flex justify-content-center">



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
            </div>


        );
    }
}

export default Profile;
