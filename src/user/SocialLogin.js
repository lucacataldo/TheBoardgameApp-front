import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";

/* Need google oAuth clientID to use this
1. Go to https://console.cloud.google.com/apis/credentials/oauthclient
2. GO to OAuth consent screen on left side bar 
    - add Authorized Domains
3. GO to Credentials on left side bar 
    - create credentials - OAuth client ID
    - Application type = Web application
    - Authorized JavaScript origins =  http://localhost:3000
4. Copy and paste the ClientID in .env file
    - REACT_APP_GOOGLE_CLIENT_ID=paste_your_client_id_here
*/
class SocialLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }

    responseGoogle = response => {
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };
        socialLogin(user).then(data => {
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                authenticate(data, () => {
                    this.setState({ redirectToReferrer: true });
                });
            }
        });
    };

    render() {
        // redirect
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }
  
        return (
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        );
    }
}   

export default SocialLogin;
 