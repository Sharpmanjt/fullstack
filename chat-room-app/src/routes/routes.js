/*------------------------------------------
    This file defines the routes for the application
/*------------------------------------------*/

import React from "react";
import {Switch} from "react-router-dom";
import Route from "./Route";
import GuestScreen from "../components/guestScreen";
import AdminLogin from "../components/adminLogin";
import AdminScreen from "../components/adminScreen";

export default function Routes(authSucess){
    return (
        <Switch>
            <Route path="/" exact component={GuestScreen}/>
            <Route path="/signIn" component={AdminLogin} />
            <Route path="/dashboard" component={AdminScreen} isPrivate />
            <Route component={GuestScreen} />
        </Switch>
    )
}

