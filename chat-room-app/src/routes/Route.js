/*-------------------------------------------------------
    This file acts as a middleware for the routes. 
    It will check if the route requested requires authentication
    If the user is not authenticated then it will return the guestScreen
/*-------------------------------------------------------*/

import React, {Component} from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from '../components/navbar';
import AdminLogin from '../components/adminLogin';

export default function RouteWrapper({
    component: Component,
    authSuccess,
    isPrivate,
    ...rest
}){
    // Get item that should have been set when the user authenticated sucessfully
    //localStorage.removeItem('signed');
    const signed = localStorage.getItem('signed');

    // If route is private and the user is not logged in
    if(isPrivate && (signed == null || signed == false)){
        return <Redirect to="/" />
    }

    // If route is public and user is logged in
    if(!isPrivate && signed){
        return <Redirect to="/dashboard" />
    }

    if(Component.name == 'AdminLogin'){
        return <Route {...rest} render={(props)=><AdminLogin {...props} authSuccess={authSuccess}/>}  />; 
    }


    return <Route {...rest} authSucess={authSuccess} component={Component} />; 
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
}

RouteWrapper.defaultProps = {
    isPrivate:false
}