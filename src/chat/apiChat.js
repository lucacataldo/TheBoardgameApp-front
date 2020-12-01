import io from "socket.io-client"

let baseUrl = `${process.env.REACT_APP_API_URL}/chat`
let ws = io(process.env.REACT_APP_CHAT_URL);

export const apiInitSocket = (token) => {
    return new Promise((resolve, reject) => {
        ws.on("connect", (event) => {
            console.log('\n SOCKET OPEN \n\n');
            ws.emit("auth", {
                token
            })
            resolve(ws)
        })
    })
}

export const apiGetChats = async (token) => {
    let resp = await fetch(`${baseUrl}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (resp.status != 200) {
        throw resp.status
    }
    let chats = await resp.json()

    chats.forEach(chat => {
        ws.emit("join", {
            chatId: chat._id
        })
    });
    return chats
};

export const apiCreateChat = async (who, token) => {
    return fetch(`${baseUrl}/start`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ who })
    })
        .then(response => {
            if (response.status != 200) {
                throw response.status
            }
            return response.json();
        })
}

export const apiGetChat = async (token, id) => {
    ws.emit("join", {
        chatId: id
    })

    let resp = await fetch(`${baseUrl}/get/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (resp.status != 200) {
        throw resp.status
    }

    let data = await resp.json()

    return data
};

export const apiSendChat = async (chatId, message, token) => {
    ws.emit("chat", {
        _id: chatId,
        message
    })
};

export const apiSearchUser = async (token, name) => {
    return fetch(`${baseUrl}/search_user`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    }).then(response => {
        if (response.status != 200) {
            throw response.status
        }
        return response.json();
    })
}