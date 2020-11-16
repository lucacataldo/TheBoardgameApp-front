import React from "react"
import { NavLink, withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth";

import { getChats, newChat } from "./apiChat";

import "../css/chat.scss"


class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      isOpen: false,
      user: isAuthenticated().user,
      chats: []
    }
  }

  componentDidMount() {
    this.openChat()
  }

  openChat = async () => {
    this.setState({
      isOpen: true
    })

    try {
      this.setState({
        chats: await getChats(isAuthenticated().token)
      })
    } catch (error) {
      console.log(error);
    }
  }

  closeChat = () => {
    this.setState({
      isOpen: false
    })
  }

  createChat = async () => {
    try {
      let resp = await newChat(document.getElementById("usernameSearch").value, isAuthenticated().token)
      let clone = this.state.chats
      clone.push(resp)
      this.setState({
        chats: clone
      })
    } catch (error) {
      switch (error) {
        case 400:
          alert("User not found, check spelling.")
          break;
        case 409:
          console.log("Chat exists, carry on...")
          break;

        default:
          break;
      }
    }
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
                  {this.state.chats.map((chat, i) => {
                    return (
                      <li className="list-group-item" key={chat._id}>
                        {chat.between[0].name} and {chat.between[1].name}
                      </li>
                    )
                  })}
                </ul>
                <div className="input-group">
                  <input id="usernameSearch" type="text" className="form-control border-primary" placeholder="Username to chat with" />
                  <div className="input-group-append">
                    <button className="btn btn-outline-primary" onClick={this.createChat}>
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