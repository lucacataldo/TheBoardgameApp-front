import React from 'react';
import { Route, Switch } from "react-router-dom";
import Home from './components/Home';
import Signup from './user/Signup';
import Signin from "./user/Signin";

const MainRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={ Signup } />
            <Route exact path="/signin" component={Signin} />
        </Switch>
    </div>
);

export default MainRouter;
