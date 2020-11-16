import React from "react"
import { NavLink, withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth";

import { apiCreateChat, apiGetChat, apiGetChats, apiSendChat } from "./apiChat";
import moment from "moment";

import "../css/chat.scss"


class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      isOpen: false,
      chatSelected: false,
      selectedChat: {},
      user: isAuthenticated().user,
      chats: [],
    }
  }

  componentDidMount() {
    this.openChatWindow()
  }

  openChatWindow = async () => {
    this.setState({
      isOpen: true
    })

    try {
      this.setState({
        chats: await apiGetChats(isAuthenticated().token)
      })
    } catch (error) {
      console.log(error);
    }
  }

  closeChatWindow = () => {
    this.setState({
      isOpen: false
    })
  }

  createChat = async () => {
    try {
      let resp = await apiCreateChat(document.getElementById("usernameSearch").value, isAuthenticated().token)
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
          alert("Something went wrong, please refresh and try again.")
          break;
      }
    }
  }

  chatPoller = 0;

  chatPollerFn = async () => {
    try {
      let id = this.state.selectedChat._id
      if (!id) {
        clearInterval(this.chatPoller)
        throw 400
      }
      let chat = await apiGetChat(isAuthenticated().token, id)
      this.setState({
        selectedChat: chat
      })

      let list = document.querySelector(".chatList")
      list.scrollTop = list.scrollHeight;
    } catch (error) {
      console.log(error);
    }
  }

  getChat = async (e) => {
    try {
      let id = e.target.dataset.id;

      let chat = await apiGetChat(isAuthenticated().token, id)


      this.setState({
        chatSelected: true,
        selectedChat: chat
      })
      
      this.chatPoller = setInterval(this.chatPollerFn, 5000)

      let list = document.querySelector(".chatList")
      list.scrollTop = list.scrollHeight;

    } catch (error) {
      console.log(error);
    }
  }

  closeChat = () => {
    this.setState({
      chatSelected: false,
      selectedChat: {}
    })
  }

  sendChat = async () => {
    try {
      let chatId = this.state.selectedChat._id
      let message = document.getElementById("chatBox").value

      let sent = await apiSendChat(chatId, message, isAuthenticated().token)

      sent.from = isAuthenticated().user
      console.log("sent\n", sent);

      let clone = this.state.selectedChat;
      clone.messages.push(sent)

      this.setState({
        selectedChat: clone
      })

      console.log(this.state.selectedChat);

      document.getElementById("chatBox").value = ""
      let list = document.querySelector(".chatList")
      list.scrollTop = list.scrollHeight;
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  chatIsFromUser = (id) => {
    return id === isAuthenticated().user._id
  }

  render() {
    return (
      <div className="chatCont">
        {isAuthenticated() && (
          <div>
            {this.state.isOpen && (
              <div className="chatWindow bg-white p-3 rounded-lg border shadow-sm">

                <div className="d-flex justify-content-between align-items-center">
                  {!this.state.chatSelected && (
                    <div>
                      <span>Chat</span>
                    </div>
                  )}
                  {this.state.chatSelected && (
                    <div className="cursor-pointer" onClick={this.closeChat}>
                      <i className="fa fa-angle-left"></i>
                    </div>
                  )}
                  {this.state.chatSelected && (
                    <div className="justify-self-center">
                      {(this.state.selectedChat.between[0]._id !== isAuthenticated().user._id) && (
                        this.state.selectedChat.between[0].name
                      )}

                      {(this.state.selectedChat.between[1]._id !== isAuthenticated().user._id) && (
                        this.state.selectedChat.between[1].name
                      )}
                    </div>
                  )}
                  <i className="fa fa-angle-down closeChatWindow cursor-pointer" onClick={this.closeChatWindow}></i>
                </div>


                {!this.state.chatSelected && (
                  <ul className="list-group chatList my-3">
                    {this.state.chats.map((chat, i) => {
                      return (
                        <li className="list-group-item cursor-pointer" onClick={this.getChat} key={chat._id} data-id={chat._id}>
                          {(chat.between[0]._id !== isAuthenticated().user._id) && (
                            chat.between[0].name
                          )}

                          {(chat.between[1]._id !== isAuthenticated().user._id) && (
                            chat.between[1].name
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}


                {/* Chat is open */}
                {this.state.chatSelected && (
                  <div className="chatList my-3">
                    {this.state.selectedChat.messages.map((msg, i) => {
                      return (
                        <div
                          key={msg.timestamp}
                          className={`d-flex justify-content-between rounded-lg chatMsg ${this.chatIsFromUser(msg.from._id) ? 'from' : ''}`}
                        >
                          <div>{msg.message}</div>
                          <div className="msgTime">{moment(msg.timestamp).fromNow()}</div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {!this.state.chatSelected && (
                  <div className="input-group">
                    <input
                      id="usernameSearch"
                      type="text"
                      className="form-control border-primary"
                      placeholder="Username to chat with"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          this.createChat()
                        }
                      }}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" onClick={this.createChat}>
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                )}

                {this.state.chatSelected && (
                  <div className="input-group">
                    <input
                      id="chatBox"
                      type="text"
                      className="form-control border-primary"
                      placeholder="Type your message"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          this.sendChat()
                        }
                      }}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" onClick={this.sendChat}>
                        <i className="fa fa-send"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!this.state.isOpen && (
              <div className="chatOpener bg-white shadow-sm" onClick={this.openChatWindow}>
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