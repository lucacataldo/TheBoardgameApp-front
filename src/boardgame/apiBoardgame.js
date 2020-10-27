export const getBGCollection = (username) => {
  return fetch(`${process.env.REACT_APP_API_URL}/boardgame/${username}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const getGuruCollection = (userId) => {
  return fetch(
    `${process.env.REACT_APP_API_URL}/boardgame/user/collection/${userId}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((err) => console.log(err));
};
export const getBGGCounts = (username) => {
  return fetch(`${process.env.REACT_APP_API_URL}/boardgame/count/${username}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getAtlasBoardgameId = (name) => {

  return fetch(`${process.env.REACT_APP_BOARDGAME_ATLAS_API_URL}/search?name=${name}&fields=id,name,price,msrp&client_id=${process.env.REACT_APP_BOARDGAME_ATLAS_CLIENT_ID}`, {
      method: "GET",
      headers: {
          'Content-Type': "application/json"
      }
  })
      .then(response => response.json())        
      .catch(err =>{
          console.log(err);
      
      })


;}

export const getAtlasBoardgamePrice = (game_id) => {

  return fetch(`${process.env.BOARDGAME_ATLAS_API_URL}/game/prices?game_id=${game_id}&client_id=${process.env.BOARDGAME_ATLAS_CLIENT_ID}`, {
      method: "GET",
      headers: {
          'Content-Type': "application/json"
      }
  })
      .then(response => response.json())         
      .catch(err =>{
          console.log(err);
      
      })


;}