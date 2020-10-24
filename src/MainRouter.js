import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

import SettingUser from "./user/SettingUser";
import SettingCollection from "./user/SettingCollection";
import Profile from "./user/Profile";
import FindPeople from "./user/FindPeople";

import Post from "./post/Post";
import Posts from "./post/Posts";
import EditPost from "./post/EditPost";
import NewPost from "./post/NewPost";

import BggCollection from "./boardgame/BggCollection";
import UserBgCollection from "./boardgame/UserBgCollection";

import Trades from "./trades/Trades";
import TradeMatch from "./trades/TradeMatch";
import TradeSettings from "./trades/TradeSettings";
import TradeListItems from "./trades/TradeRequestContainer";
import RequestSent from "./components/RequestSent"

import Users from "./user/Users";
import PrivateRoute from "./auth/PrivateRoute"; // only authenticated user can use

import Admin from "./admin/Admin";
import CalContainer from "./calendar/CalContainer";

class MainRouter extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/posts" component={Posts} />
          <Route exact path="/collection/bgg" component={BggCollection} />
          <PrivateRoute
            exact
            path="/collection/bgguru"
            component={UserBgCollection}
          />
          <PrivateRoute exact path="/trades" component={Trades} />
          <PrivateRoute exact path="/trades/matches" component={TradeMatch} />
          <PrivateRoute
            exact
            path="/trades/settings"
            component={TradeSettings}
          />
           <Route exact path="/requestSent" component={RequestSent} />
          <Route exact path="/newTrade" component={TradeListItems} />
          <PrivateRoute exact path="/admin" component={Admin} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:resetPasswordToken"
            component={ResetPassword}
          />
          <PrivateRoute exact path="/post/create" component={NewPost} />
          <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
          <Route exact path="/post/:postId" component={Post} />
          <Route exact path="/Users" component={Users} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/signin" component={Signin} />
          <PrivateRoute exact path="/findpeople" component={FindPeople} />
          <PrivateRoute exact path="/user/:userId" component={Profile} />
          <PrivateRoute
            exact
            path="/user/edit/:userId"
            component={SettingUser}
          />
          <PrivateRoute
            exact
            path="/user/edit/bgg/:userId"
            component={SettingCollection}
          />
          <Route exact path="/calendar" component={CalContainer} />
          <Route path="*" component={NotFound} />
        </Switch>
      </>
    );
  }
}

export default MainRouter;
