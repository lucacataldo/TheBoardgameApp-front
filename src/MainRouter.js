import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import NavBar from "./components/NavBar";

import Signup from "./user/Signup";
import Signin from "./user/Signin";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import FindPeople from "./user/FindPeople";

import Post from "./post/Post";
import Posts from "./post/Posts";
import EditPost from "./post/EditPost";
import NewPost from "./post/NewPost";

import Users from "./user/Users";
import PrivateRoute from "./auth/PrivateRoute"; // only authenticated user can use

import Admin from './admin/Admin'

class MainRouter extends React.Component {
    render() {
        return (
            <>
                <NavBar />
                <div className="container-fluid">
                    <Switch>
                        <Route exact path="/" render={() => (<Home />)} />
                        <Route exact path="/posts" component={Posts} />
                        <PrivateRoute exact path="/admin" component={Admin} />

                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />

                        <PrivateRoute exact path="/post/create" component={NewPost} />
                        <Route exact path="/post/:postId" component={Post} />

                        <Route exact path="/Users" component={Users} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/signin" component={Signin} />

                        <PrivateRoute exact path="/findpeople" component={FindPeople} />
                        <PrivateRoute exact path="/user/:userId" component={Profile} />
                        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
                        <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
                    </Switch>
                </div>
            </>
        );
    }
}

export default MainRouter;

// const MainRouter = () => (
//     <div>
//         <NavBar />
//         <Switch>
//             <Route exact path="/" component={Home} />
//             <PrivateRoute exact path="/admin" component={Admin} />

//             <Route exact path="/forgot-password" component={ForgotPassword} />
//             <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />

//             <PrivateRoute exact path="/post/create" component={NewPost} />
//             <Route exact path="/post/:postId" component={Post} />

//             <Route exact path="/Users" component={Users} />
//             <Route exact path="/signup" component={Signup} />
//             <Route exact path="/signin" component={Signin} />

//             <PrivateRoute exact path="/findpeople" component={FindPeople} />
//             <PrivateRoute exact path="/user/:userId" component={Profile} />
//             <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
//             <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
//         </Switch>
//     </div>
// );

// export default MainRouter;
