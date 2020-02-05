import React, { Component } from "react";
import { Link } from "react-router-dom";

import { getPost } from "./apiPost";
import DefaultPostImg from "../images/defaultPostImg.jpg";


class Post extends Component {
    state = {
        post: ""
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        getPost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ post: data });
            }
        });
    };

    renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        return (
            <div className="card-body">
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${
                        post._id
                    }`}
                    alt={post.title}
                    onError={i => (i.target.src = `${DefaultPostImg}`)}
                    className="img-thunbnail mb-3"
                    style={{
                        height: "300px",
                        width: "100%",
                        objectFit: "cover"
                    }}
                />

                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.createdDate).toDateString()}
                </p>
                <Link to={`/`} className="btn btn-raised btn-primary btn-sm">
                    Back to posts
                </Link>
            </div>
        );
    };

    render() {
        const { post } = this.state;
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}
            </div>
        );
    }
}

export default Post;
