import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Menu from "./components/Menu";

import Signup from "./user/Signup";
import Signin from "./user/Signin";

import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import FindPeople from "./user/FindPeople";

import Post from "./post/Post";
import EditPost from "./post/EditPost";
import NewPost from "./post/NewPost";

import Users from "./user/Users";
import PrivateRoute from "./auth/PrivateRoute"; // only authenticated user can use

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Home} />
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
);

export default MainRouter;
