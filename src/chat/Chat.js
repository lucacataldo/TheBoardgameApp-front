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
      loading: null,
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

        this.scrollChat()
      })
    })
  }

  openChatWindow = async () => {
    try {
      this.setState({
        isOpen: true,
        loading: "chats",
        newMessage: false
      })
      let chats = await apiGetChats(isAuthenticated().token);
      this.setState({
        chats,
        loading: null
      })
    } catch (error) {
      this.setState({
        loading: null
      })
      console.log(error);
    }
  }

  closeChatWindow = () => {
    this.setState({
      isOpen: false,
      chats: [],
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
      document.getElementById("usernameSearch").value = "";
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

  getChat = async (e) => {
    try {

      let id = e.currentTarget.dataset.id;

      this.setState({
        loading: id
      })

      let chat = await apiGetChat(isAuthenticated().token, id)


      this.setState({
        chatSelected: true,
        selectedChat: chat,
        loading: null
      })

      this.scrollChat()

    } catch (error) {
      this.setState({
        loading: null
      })
      console.log(error);
    }
  }

  closeChat = async () => {
    try {
      this.setState({
        chatSelected: false,
        loading: "chats",
        chats: []
      })

      let chats = await apiGetChats(isAuthenticated().token);
      this.setState({
        chats,
        selectedChat: {},
        loading: null
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

      if (message.trim().length === 0) {
        throw "Message empty."
      }

      apiSendChat(chatId, message, isAuthenticated().token)

      document.getElementById("chatBox").value = ""
      this.scrollChat()
    } catch (error) {
      console.log(error)
    }
  }

  chatIsFromUser = (from) => {
    let id = (from._id ? from._id : from)
    return id === isAuthenticated().user._id
  }

  scrollChat = () => {
    try {
      let list = document.querySelector(".chatList")
      list.scrollTop = list.scrollHeight;
    } catch (error) {
      console.log(error);
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
                  <div className={`chatList my-2`}>
                    {this.state.loading === "chats" && (
                      <div className="text-center">
                        <i className="fa fa-circle-notch loader"></i>
                      </div>
                    )}
                    {this.state.chats.map((chat, i) => {
                      return (
                        <div
                          className="cursor-pointer chat p-2 rounded border border-primary my-2 d-flex justify-content-between"
                          onClick={this.getChat}
                          key={chat._id}
                          data-id={chat._id}
                        >
                          <div>
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


                          {this.state.loading === chat._id && (
                            <div className="d-flex justify-content-center align-items-center">
                              <i className="fa fa-circle-notch loader"></i>
                            </div>
                          )}

                        </div>
                      )
                    })}
                  </div>
                )}


                {/* Chat is open */}
                {this.state.chatSelected && (
                  <div className="chatList my-2">
                    <div className="text-center preChat">
                      Start the conversation! Note that we may clear out messages older than 3 months from time to time.
                    </div>
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
                        <i className="fa fa-user-plus"></i>
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
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!this.state.isOpen && (
              <div className="chatOpener bg-white" onClick={this.openChatWindow}>
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