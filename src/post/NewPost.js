import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { createPost } from "./apiPost";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    if (title.length > 60) {
      this.setState({
        error: "Title is limited to 60 characters",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      createPost(userId, token, this.postData).then(data => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  newPostForm = (title, body) => (
    <form>
      <label className="text-muted">Title</label>
      <br />
      <input
        onChange={this.handleChange("title")}
        type="text"
        className="form-control"
        value={title}
      />

      <div className="form-group mt-2">
        <label className="text-muted">Body</label>
        <textarea
          rows="4"
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
          style={{ resize: "none" }}
        />
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroupFileAddon01">
            Upload
          </span>
        </div>
        <div className="custom-file">
          <input
            type="file"
            accept="image/*"
            data-max-file-size="1M"
            className="custom-file-input"
            id="inputGroupFile01"
            onChange={this.handleChange("photo")}
            aria-describedby="inputGroupFileAddon01"
          />
          <label className="custom-file-label" htmlFor="inputGroupFile01">
            Choose file
          </label>
        </div>
      </div>

      <button
        onClick={this.clickSubmit}
        className="btn btn-raised btn-primary mt-3"
      >
        Create Post
      </button>
    </form>
  );

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container">
        <h1 className="mt-5 mb-4">
          <b>Create a new post</b>
        </h1>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;
