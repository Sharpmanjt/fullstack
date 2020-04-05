/*------------------------------------------
    This file defines the routes for the application
/*------------------------------------------*/

import React from "react";
import {Switch} from "react-router-dom";
import Route from "./Route";
import GuestScreen from "../components/guestScreen";
import AdminLogin from "../components/adminLogin";
import AdminScreen from "../components/adminScreen";

export default function Routes(authSuccess){
    return (
        <Switch>
            <Route path="/" exact component={GuestScreen} authSuccess={authSuccess}/>
            <Route path="/signIn" component={AdminLogin} authSuccess={authSuccess} />
            <Route path="/dashboard" component={AdminScreen} authSuccess={authSuccess} isPrivate />
            <Route component={GuestScreen} />
        </Switch>
    )
}

