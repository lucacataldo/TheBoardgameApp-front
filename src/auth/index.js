export const signup = user => {
    // process.env to access REACT_APP backend URL
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const signin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const googleLogin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/google-login/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const facebookLogin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/facebook-login/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const authenticate = (jwt, next) => {
    if (typeof window !== "undefined") {
        // pass json web token to localStorage 
        // this allow the user to be authenticated
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
};

export const signout = next => {
    if (typeof window !== "undefined") localStorage.removeItem("jwt");
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
        .then(response => {
            //console.log("signout", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};

export const forgotPasswordReq = email => {
    //console.log("email: ", email);
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            //console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetPasswordReq = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            //console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};