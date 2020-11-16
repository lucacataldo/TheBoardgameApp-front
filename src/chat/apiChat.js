export const getChats = async (token) => {
    let resp = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (resp.status != 200) {
        throw "Error"
    }
    return resp.json()
};

export const newChat = async (who, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/chat/start`, {
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