import React, { Component } from "react";
import "./App.css";
import Navbar from "../src/components/navbar";
import AdminLogin from "../src/components/adminLogin";
import AdminScreen from "./components/adminScreen";
import GuestScreen from "../src/components/guestScreen";
import io from "socket.io-client";
import { Router } from 'react-router-dom';
import  Routes  from './routes/routes';
import history from './services/history';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdminLoggedIn: false,
      loggingIn: false
    };

    let signed = localStorage.getItem("signed");
    if(signed){
      this.setState({isAdminLoggedIn:true});
    }else{
      this.setState({isAdminLoggedIn:false})
    }
  }

  loginAdmin = () => {
    history.push('/signIn')
  }
  
  logoutAdmin = () => {
    localStorage.removeItem('signed');
    this.setState({isAdminLoggedIn:false})
    history.push('/');
  }

  authSucess = () => {
    this.setState({isAdminLoggedIn:true})
    this.render();
    history.push('/dashboard')
  }

  setLoggingIn = isLoggingIn => {
    this.setState({
      loggingIn: isLoggingIn
    });
  };

  setAdminLoggedIn = isLoggedIn => {
    this.setState({
      isAdminLoggedIn: isLoggedIn
    });
  };

  cancelLoginDialog = () => {
    this.setState({
      isAdminLoggedIn: false,
      loggingIn: false
    });
  }

  render() {
    const socket = io.connect("http://localhost:5000");
    
    return (
      <div>
        <Navbar
                isAdminLoggedIn={this.state.isAdminLoggedIn}
                adminLogin={this.loginAdmin}
                adminLogout={this.logoutAdmin}
          ></Navbar>
        <Router history={history}>
          <Routes />
        </Router>
      </div>
     
    );
  }
}
