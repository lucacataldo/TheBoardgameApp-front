import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfileImg from "../images/avatar.png";
import Table from "react-bootstrap/Table";

class ProfileTabs extends Component {
  
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div className="">
        <div className="row">
          <div className="col-md-4">
            <h4>
              <strong>Followers</strong>
            </h4>
            <h1>{followers.length}</h1>
            {followers < 1 ? "You have no followers yet :(" :
            <Table hover bordered className="bg-white">
              <tbody>
                {followers.map((person, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`/user/${person._id}`} className="text-dark">
                        <img
                          className="float-left mr-2"
                          height="30px"
                          onError={i => (i.target.src = `${DefaultProfileImg}`)}
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          alt={person.name}
                        />
                        <div>
                          <p className="lead my-0">{person.name}</p>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>}
          </div>

          <div className="col-md-4">
            <h4>
              <strong>Following</strong>
            </h4>
            <h1>{following.length}</h1>
            {following < 1 ? "You are not currently following anyone." :
            <Table hover bordered className="bg-white">
              <tbody>
                {following.map((person, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`/user/${person._id}`} className="text-dark">
                        <img
                          className="float-left mr-2"
                          style={{ borderRadius: "50%" }}
                          height="30px"
                          width="30px"
                          onError={i => (i.target.src = `${DefaultProfileImg}`)}
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          alt={person.name}
                        />

                        <p className="lead my-0">{person.name}</p>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>}
          </div>

          <div className="col-md-4">
            <h4>
              <strong>Posts</strong>
            </h4>
            <h1>{posts.length}</h1>
            {posts < 1 ? "You have no posts yet :(" :
            <Table hover bordered className="bg-white">
              <tbody>
                {posts.map((post, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`/post/${post._id}`} className="text-dark">
                   
                        {post.title.length > 24 ? <div>
                          <p className="lead my-0">{post.title.substring(0,23)}...</p>
                        </div>
                        :
                        <div>
                          <p className="lead my-0">{post.title}</p>
                        </div>}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
