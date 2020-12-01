import React from "react"
import { withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth";

import { apiInitSocket, apiCreateChat, apiGetChat, apiGetChats, apiSendChat, apiSearchUser } from "./apiChat";
import moment from "moment";

import DefaultProfileImg from "../images/avatar.png";

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
      muted: false,
      userSearchResults: [],
      toastMsg: null
    }
  }

  toast = (message, type = "danger") => {
    this.setState({
      toastMsg: { type, message }
    })

    setTimeout(() => {
      this.setState({
        toastMsg: null
      })
    }, 3000);
  }

  componentDidMount() {
    try {
      let muted = localStorage.getItem("muted") === "true"
      this.setState({
        muted
      })
    } catch (error) {
      console.log(error);
    }


    apiInitSocket(isAuthenticated().token).then(async (ws) => {
      try {
        await this.getChats()

        setInterval(() => {
          this.getChats(true)
        }, process.env.REACT_APP_CHAT_REFRESH || 60000);

        ws.on("newMsg", (data) => {
          if (!this.state.muted && (data.from !== isAuthenticated().user._id)) {
            document.getElementById("msgDing").play()
          }

          if (this.state.chatSelected && (data._id === this.state.selectedChat._id)) {
            let clone = this.state.selectedChat;
            clone.messages.push(data)

            this.setState({
              selectedChat: clone,
            })

            if (!this.state.isOpen) {
              this.setState({
                newMessage: true
              })
            }

            this.scrollChat()
          } else {
            apiGetChat(isAuthenticated().token, data._id).then((chat) => {
              let i = this.state.chats.findIndex(c => c._id === chat._id)
              let clone = this.state.chats
              clone[i] = chat;

              this.setState({
                chats: clone
              })
            })
            this.setState({
              newMessage: true
            })
          }

        })
      } catch (error) {
        console.log(error);
      }

    })
  }

  getChats = (isRefresh = false) => {
    return new Promise((resolve, reject) => {
      apiGetChats(isAuthenticated().token, isRefresh).then((chats) => {
        if (isRefresh && chats.length && this.state.chats.length && (this.state.chats.length < chats.length)) {
          this.setState({
            newMessage: true
          })
          document.getElementById("msgDing").play()
        }
        this.setState({
          chats,
          loading: null
        })
        resolve(chats)
      }).catch(err => {
        reject(err)
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
      let chats = await this.getChats();
      this.scrollChat()
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
          this.toast("User not found, check spelling.")
          break;
        case 409:
          console.log("Chat exists, carry on...")
          break;

        default:
          this.toast("Something went wrong, please refresh and try again.")
          break;
      }
    }
  }

  searchTimeout;

  searchUser = (e) => {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(async () => {
      let value = document.getElementById("usernameSearch").value;
      if (value === "" || value === " ") {
        this.setState({
          userSearchResults: []
        })
        return 0
      }
      try {
        let resp = await apiSearchUser(isAuthenticated().token, value);
        this.setState({
          userSearchResults: resp
        })
      } catch (error) {
        if (error === 429) {
          this.toast("You're doing that too often, try again soon.")
        } else {
          this.toast("Something went wrong. Please refresh and try again")
        }
      }

    }, 200);
  }

  selectUser = (e) => {
    document.getElementById("usernameSearch").value = e.target.dataset.username;
    this.createChat()
    this.setState({
      userSearchResults: []
    })
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

      let chats = await this.getChats();
      this.setState({
        selectedChat: {},
      })
    } catch (error) {
      this.toast("An error occurred while getting chats, check log for more info.")
      console.log(error);
    }

  }

  sendChat = async () => {
    try {
      let chatId = this.state.selectedChat._id
      let message = document.getElementById("chatBox").value

      if (message.trim().length === 0) {
        throw new Error("Message empty.")
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
    let list = document.querySelector(".chatView")
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }

  muteToggle = () => {

    localStorage.setItem("muted", !this.state.muted)

    this.setState({
      muted: !this.state.muted
    })
  }

  render() {
    return (
      <div className="chatCont">
        {isAuthenticated() && (
          <div>
            <audio id="msgDing" src="/pop.wav" controls={false}></audio>
            {this.state.isOpen && (
              <div className="chatWindow bg-white p-3 rounded-lg border shadow-sm">
                {this.state.toastMsg && (
                  <div className={`d-flex justify-content-center align-items-center alert alert-${this.state.toastMsg.type}`}>
                    <span style={{ fontSize: "0.8em" }}>{this.state.toastMsg.message}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center text-info">
                  {!this.state.chatSelected && (
                    <div>
                      <span>Chat</span>
                    </div>
                  )}
                  {this.state.chatSelected && (
                    <div className="cursor-pointer closeChat px-2" onClick={this.closeChat}>
                      <i className="fa fa-arrow-left"></i>
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
                  <div>
                    <i
                      className={`fa ${this.state.muted ? 'fa-volume-mute' : 'fa-volume-up'} chatMute p-1 mr-2 cursor-pointer`}
                      onClick={this.muteToggle}
                    ></i>
                    <i className="fa fa-angle-down closeChatWindow cursor-pointer p-2" onClick={this.closeChatWindow}></i>
                  </div>

                </div>


                {!this.state.chatSelected && (
                  <div className={`chatList my-2`}>
                    {this.state.loading === "chats" && (
                      <div className="text-center">
                        <i className="fa fa-circle-notch loader"></i>
                      </div>
                    )}
                    {this.state.chats.length < 1 && (
                      <div className="text-center preChat py-5">
                        No chats yet!
                      </div>
                    )}
                    {this.state.chats.sort((a, b) => {
                      let lastA, lastB;
                      try {
                        lastA = new Date(a.messages[a.messages.length - 1].timestamp).getTime()
                      } catch (error) {
                        lastA = 0
                      }

                      try {
                        lastB = new Date(b.messages[b.messages.length - 1].timestamp).getTime()
                      } catch (error) {
                        lastB = 0
                      }

                      if (lastA > lastB) {
                        return -1
                      } else if (lastA < lastB) {
                        return 1
                      } else {
                        return 0
                      }
                    }).map((chat, i) => {
                      return (
                        <div
                          className="cursor-pointer chat p-2 card chat text-info d-flex justify-content-between"
                          onClick={this.getChat}
                          key={chat._id}
                          data-id={chat._id}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <img
                              className="chatProfImg shadow-sm mx-3"
                              src={`${process.env.REACT_APP_API_URL}/user/photo/${chat.between.filter(e => e._id !== isAuthenticated().user._id)[0]._id}`}
                              onError={(e) => { e.target.onerror = null; e.target.src = `${DefaultProfileImg}` }}
                            />
                            <div className="flex-grow-1">
                              <h6>
                                {
                                  chat.between.filter(
                                    e => e._id !== isAuthenticated().user._id
                                  )[0].name
                                }
                              </h6>
                              <div>
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




                        </div>
                      )
                    })}
                  </div>
                )}


                {/* Chat is open */}
                {this.state.chatSelected && (
                  <div className="chatView my-2">
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
                    {this.state.userSearchResults.length > 0 && (
                      <div className="bg-white rounded-lg card usersFound">
                        {this.state.userSearchResults.map((res) => {
                          return (
                            <div className="result" key={res._id} data-username={res.name} onClick={this.selectUser}>
                              {res.name}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <input
                      id="usernameSearch"
                      type="text"
                      className="form-control border-primary rounded"
                      placeholder="Start typing a username"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          this.createChat()
                        } else {
                          this.searchUser(e)
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