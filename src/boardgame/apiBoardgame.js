import { isAuthenticated } from "../auth";

export const getBGCollection = (username, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/boardgame/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const getGuruCollection = (userId, token) => {
  return fetch(
    `${process.env.REACT_APP_API_URL}/boardgame/user/collection/${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((err) => console.log(err));
};
export const getBGGCounts = (username, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/boardgame/count/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateUserBoardgames = (userId, boardgameUpdate) => {
  let token = isAuthenticated().token;
  return fetch(
    `${process.env.REACT_APP_API_URL}/boardgame/user/collection/${userId}/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(boardgameUpdate),
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json
      } else {
       throw {response} 
      }
    })
    .then((data) => {
      return data;
    })
};

export const getAtlasBoardgameId = (name) => {
  return fetch(
    `${process.env.REACT_APP_BOARDGAME_ATLAS_API_URL}/search?name=${name}&fields=id,name,price,msrp&client_id=${process.env.REACT_APP_BOARDGAME_ATLAS_CLIENT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });
};

export const getAtlasBoardgamePrice = (game_id) => {
  return fetch(
    `${process.env.BOARDGAME_ATLAS_API_URL}/game/prices?game_id=${game_id}&client_id=${process.env.BOARDGAME_ATLAS_CLIENT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });
};
