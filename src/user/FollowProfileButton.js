import React, { Component } from "react";
import { followUser, unfollowUser } from "./apiUser";

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(followUser);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollowUser);
    };

    render() {
        return (
            <div className="">
                {!this.props.following ? (
                    <button
                        onClick={this.followClick}
                        className="btn btn-success w-100"
                    >
                        Follow
                    </button>
                ) : (
                        <button
                            onClick={this.unfollowClick}
                            className="btn btn-outline-danger w-100"
                        >
                            UnFollow
                    </button>
                    )}
            </div>
        );
    }
}

export default FollowProfileButton;
