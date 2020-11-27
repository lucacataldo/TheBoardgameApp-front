import { Link, Route } from "react-router-dom";
import React, { useState, useRef, useCallback } from "react";

import useFetchMorePosts from "./useFetchMorePosts";
import Animator from "../animator/Animator";
import Helpers from "../helpers";

const Posts = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { posts, hasMore, loading, error } = useFetchMorePosts(pageNumber);
  const refObserver = useRef();

  // whenever the <div ref={lastPostElementRef} key={i}> is created,
  // it will call this fxn when it's the last element
  const lastPostElementRef = useCallback(
    node => {
      Animator.animate();
      if (loading) return;
      // disconnect previous ref so we can reset it
      if (refObserver.current) refObserver.current.disconnect();
      // take all entries available
      refObserver.current = new IntersectionObserver(entries => {
        // if the entry is on the page and there's more to load
        // wont keep calling api if the api provided all the items
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      // observe the node if its last
      if (node) refObserver.current.observe(node);
    },
    [loading, hasMore]
  );

  function renderPost(post) {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy
      ? Helpers.capitalize(post.postedBy.name)
      : " Unknown";

    return (
      <div className="card animator mb-3">
        {post.photo && (
          <img
            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
            alt={post.title}
            className="img-thumbnail postsImg mx-auto d-block"
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text text-truncate">{post.body}</p>
        </div>
        <div className="card-footer text-muted">
          <div className="row justify-content-between">
            <div className="col-9">
              Posted by <Link to={`${posterId}`}>{posterName} </Link>on{" "}
              {new Date(post.createdDate).toDateString()}
            </div>
            <div className="col-3 text-right">
              <Link
                to={`/post/${post._id}`}
                className="btn btn-raised btn-primary btn-sm"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row justify-content-center postRow">
        <div className="card mt-3">
          <h5 className="card-header">Create Post</h5>
          <div className="card-body">
            <Route
              render={({ history }) => (
                <form>
                  <div className="input-group">
                    <input
                      className="form-control"
                      placeholder="Post some Boardgames! :3"
                      onFocus={() => {
                        history.push("/post/create");
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <Link to={`/post/create`}>
                          <i className="fa fa-image text-dark"></i>
                        </Link>
                      </span>
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>

      {posts.map((post, i) => {
        if (posts.length === i + 1) {
          return (
            <div
              className="row justify-content-center postRow"
              ref={lastPostElementRef}
              key={i}
            >
              {renderPost(post)}
            </div>
          );
        } else {
          return (
            <div className="row justify-content-center postRow" key={i}>
              {renderPost(post)}
            </div>
          );
        }
      })}
      {!hasMore && (
        <div className="row justify-content-center postRow">No More Post</div>
      )}
      <div className="row justify-content-center postRow">
        {loading && "Loading..."}
      </div>
      <div className="row justify-content-center postRow">
        {error && "Error"}
      </div>
    </>
  );
};

export default Posts;
