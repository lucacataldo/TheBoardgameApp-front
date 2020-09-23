import XML2JS from 'xml2js';

export const getBGCollection = (username) => {
    return fetch(`${process.env.REACT_APP_API_URL}/boardgame/${username}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));

};
export const getGuruCollection = (username) => {
    return fetch(`${process.env.REACT_APP_API_URL}/boardgame/${username}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const getBGGCounts = (username) => {
    return fetch(`${process.env.REACT_APP_API_URL}/boardgame/count/${username}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));

};