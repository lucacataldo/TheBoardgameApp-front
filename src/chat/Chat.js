import React from "react"
import { NavLink, withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth";

import "../css/chat.scss"


class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      isOpen: true,
      user: isAuthenticated().user
    }
  }

  openChat = () => {
    this.setState({
      isOpen: true
    })
  }

  closeChat = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
    return (
      <div className="chatCont">
        {isAuthenticated() && (
          <div>
            {this.state.isOpen && (
              <div className="chatWindow bg-white p-3 rounded-lg border shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Chat</span>
                  <i className="fa fa-angle-down closeChat" onClick={this.closeChat}></i>
                </div>
                <ul className="list-group chatList my-3">
                  <li className="list-group-item">UserName</li>
                  <li className="list-group-item">UserName</li>
                  <li className="list-group-item">UserName</li>
                </ul>
                <div className="input-group">
                  <input type="text" className="form-control border-primary" placeholder="Username to chat with"/>
                  <div className="input-group-append">
                    <button className="btn btn-outline-primary">
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!this.state.isOpen && (
              <div className="chatOpener bg-white shadow-sm" onClick={this.openChat}>
                <i className="fa fa-comments"></i>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Chat);