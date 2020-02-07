import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';

import { socialLogin, authenticate } from "../auth";

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
    responseFacebook = response => {
        // console.log(response);
        const { id, name, email, picture } = response;
        const user = {
            password: id,
            name: name,
            email: email,
            imageUrl: picture.data.url
        };
        //console.log(user);
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

            <div class="btn-toolbar" role="toolbar">
                <div class="btn-group mr-2" role="group" >
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        icon={false}
                        render={renderProps => (
                            <button className="btnGoogle" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                <i className="fa fa-google-plus" style={{ marginLeft: '5px' }} />
                                <span>&nbsp;&nbsp;Sign In with Google</span>
                            </button>
                        )}
                    />
                </div>
                <div class="btn-group" role="group" >
                    <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                        fields="id,name,email,picture"
                        callback={this.responseFacebook}
                        autoLoad={false}
                        reauthenticate={true}
                        cssClass="btnFacebook"
                        icon={<i className="fa fa-facebook" style={{ marginLeft: '5px' }}></i>}
                        textButton="&nbsp;&nbsp;Sign In with Facebook"
                    />
                </div>
            </div>
        );
    }
}

export default SocialLogins;
