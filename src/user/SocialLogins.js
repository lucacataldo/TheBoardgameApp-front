import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

import { googleLogin, facebookLogin, authenticate } from "../auth";

/* Need google oAuth clientID for google login
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

/* Need facebook app id for facebook login
1. Go to https://developers.facebook.com/ 
2. Create App
    - APP ID should be on top
    - Copy and paste to .env file
    - REACT_APP_FACEBOOK_APP_ID=paste_your_app_id_here
3. Go to Settings -> Basic on left sidebar
    - App Domains - localhost   
 */
class SocialLogins extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false
    };
  }

  responseGoogle = response => {
    //console.log(response);
    const tokenId = response.tokenId;
    const user = {
      tokenId: tokenId
    };

    googleLogin(user).then(data => {
      if (data.error) {
        console.log("Error Login. Please try again..");
      } else {
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  responseFacebook = response => {
    const { id, name, email, picture } = response;
    const user = {
      password: id,
      name: name,
      email: email,
      imageUrl: picture.data.url
    };
    facebookLogin(user).then(data => {
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
      return <Redirect to="/posts" />;
    }

    return (
      <div className="text-center social-btn">
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={"single_host_origin"}
          icon={false}
          render={renderProps => (
            <button
              className="btn btn-danger btn-block"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <i className="fa fa-google" style={{ marginLeft: "5px" }} />
              <span>&nbsp;&nbsp;{this.props.title} with Google</span>
            </button>
          )}
        />

        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          fields="id,name,email,picture"
          callback={this.responseFacebook}
          autoLoad={false}
          reauthenticate={true}
          cssClass="btn btn-primary btn-block"
          icon={
            <i className="fa fa-facebook" style={{ marginLeft: "5px" }}></i>
          }
          textButton={this.props.title + " with Facebook"}
        />
      </div>
    );
  }
}

export default SocialLogins;
