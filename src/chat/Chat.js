import React from "react"
import { NavLink, withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth";

import { apiInitSocket, apiCreateChat, apiGetChat, apiGetChats, apiSendChat } from "./apiChat";
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
      newMessage: false,
    }
  }

  componentDidMount() {
    apiInitSocket(isAuthenticated().token).then((ws) => {
      ws.on("newchat", (data) => {
        let clone = this.state.selectedChat;
        clone.messages.push(data)

        this.setState({
          selectedChat: clone,
          newMessage: true
        })

        let list = document.querySelector(".chatList")
        list.scrollTop = list.scrollHeight;
      })
    })
  }

  openChatWindow = async () => {
    this.setState({
      isOpen: true
    })

    try {
      let chats = await apiGetChats(isAuthenticated().token);
      this.setState({
        chats
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

  /*chatPollerFn = async () => {
    try {
      let id = this.state.selectedChat._id
      if (!id) {
        clearInterval(this.chatPoller)
        throw "Chat deselected, pausing polling..."
      }
      let chat = await apiGetChat(isAuthenticated().token, id)

      if (JSON.stringify(this.state.selectedChat) != JSON.stringify(chat)) {
        this.setState({
          selectedChat: chat,
          newMessage: true
        })

      }

    } catch (error) {
      console.log(error);
    }
  }*/

  getChat = async (e) => {
    try {
      let id = e.currentTarget.dataset.id;

      let chat = await apiGetChat(isAuthenticated().token, id)


      this.setState({
        chatSelected: true,
        selectedChat: chat
      })

      // this.chatPoller = setInterval(this.chatPollerFn, 5000)

      let list = document.querySelector(".chatList")
      list.scrollTop = list.scrollHeight;

    } catch (error) {
      console.log(error);
    }
  }

  closeChat = async () => {
    try {
      this.setState({
        chatSelected: false,
        chats: await apiGetChats(isAuthenticated().token),
        selectedChat: {}
      })
    } catch (error) {
      alert("An error occurred while getting chats, check log for more info.")
      console.log(error);
    }

  }

  sendChat = async () => {
    try {
      let chatId = this.state.selectedChat._id
      let message = document.getElementById("chatBox").value

      apiSendChat(chatId, message, isAuthenticated().token)

      document.getElementById("chatBox").value = ""
      let list = document.querySelector(".chatList")
      list.scrollTop = list.scrollHeight;
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  chatIsFromUser = (from) => {
    let id = (from._id ? from._id : from)
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
                    <div className="cursor-pointer px-2" onClick={this.closeChat}>
                      <i className="fa fa-angle-left"></i>
                    </div>
                  )}
                  {this.state.chatSelected && (
                    <div className="justify-self-center">
                      {
                        this.state.selectedChat.between.filter(
                          e => e._id !== isAuthenticated().user._id
                        )[0].name
                      }
                    </div>
                  )}
                  <i className="fa fa-angle-down closeChatWindow cursor-pointer px-2" onClick={this.closeChatWindow}></i>
                </div>


                {!this.state.chatSelected && (
                  <div className="chatList my-2">
                    {this.state.chats.map((chat, i) => {
                      return (
                        <div className="cursor-pointer chat p-2 rounded border border-primary my-2" onClick={this.getChat} key={chat._id} data-id={chat._id}>
                          <div>
                            {
                              chat.between.filter(
                                e => e._id !== isAuthenticated().user._id
                              )[0].name
                            }
                          </div>

                          <div>
                            {chat.messages[chat.messages.length - 1] && (
                              '"' + chat.messages[chat.messages.length - 1].message + '" '
                            )}
                            {chat.messages[chat.messages.length - 1] && (
                              moment(chat.messages[chat.messages.length - 1].timestamp).fromNow()
                            )}
                          </div>

                        </div>
                      )
                    })}
                  </div>
                )}


                {/* Chat is open */}
                {this.state.chatSelected && (
                  <div className="chatList my-2">
                    {this.state.selectedChat.messages.map((msg, i) => {
                      return (
                        <div
                          key={msg.timestamp}
                          className={`
                            d-flex justify-content-between rounded-lg chatMsg 
                            ${this.chatIsFromUser(msg.from) ? 'from' : ''}`}
                        >
                          <div className="msgText">{msg.message}</div>
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
                {this.state.newMessage && (
                  <div className="newMsgBadge"></div>
                )}
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