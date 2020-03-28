import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfileImg from "../images/avatar.png";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div className="">
        <div className="row">
          <div className="col-md-4">
            <h4 className="text-dark">
              <strong>Followers</strong>
              <FontAwesomeIcon icon={faDice} />
            </h4>
            <hr />
            <Table hover>
              <tbody>
                {followers.map((person, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`/user/${person._id}`}>
                        <img
                          className="float-left mr-2"
                          height="30px"
                          onError={i => (i.target.src = `${DefaultProfileImg}`)}
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          alt={person.name}
                        />
                        <div>
                          <p className="lead">{person.name}</p>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="col-md-4">
            <h4 className="text-dark">
              <strong>Following</strong>
              <FontAwesomeIcon icon={faDice} />
            </h4>
            <hr />
            <Table hover bordered>
              <tbody>
                {following.map((person, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`/user/${person._id}`}>
                        <img
                          className="float-left mr-2"
                          style={{ borderRadius: "50%" }}
                          height="30px"
                          width="30px"
                          onError={i => (i.target.src = `${DefaultProfileImg}`)}
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          alt={person.name}
                        />

                        <p className="lead">{person.name}</p>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="col-md-4">
            <h4 className="text-dark">
              <strong>Posts</strong>
              <FontAwesomeIcon icon={faDice} />
            </h4>
            <hr />
            <Table hover>
              <tbody>
                {posts.map((post, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`/post/${post._id}`}>
                        <div>
                          <p className="lead">{post.title}</p>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
