export const createEvent = (userId, token, event) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/new/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getEvent = (eventId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getEventsByUserId = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/events/by/${userId}`, {
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

export const removeEvent = (eventId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
    method: "DELETE",
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

export const updateEvent = (eventId, token, event) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
