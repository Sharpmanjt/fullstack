import React, { Component } from "react";
import "./App.css";
import Navbar from "../src/components/navbar";
import AdminLogin from "../src/components/adminLogin";
import AdminScreen from "./components/adminScreen";
import GuestScreen from "../src/components/guestScreen";
import io from "socket.io-client";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdminLoggedIn: false,
      loggingIn: false
    };
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
        {this.state.loggingIn ? (
          <AdminLogin
            setAdminLoggedIn={this.setAdminLoggedIn}
            setLoggingIn={this.setLoggingIn}
            handleCancel={this.cancelLoginDialog}
          ></AdminLogin>
        ) : (
          [
            <Navbar
              setAdminLoggedIn={this.setAdminLoggedIn}
              setLoggingIn={this.setLoggingIn}
              isAdminLoggedIn={this.state.isAdminLoggedIn}
            ></Navbar>,
            <div>
              {this.state.isAdminLoggedIn ? (
                <AdminScreen></AdminScreen>
              ) : (
                <GuestScreen socket={socket}></GuestScreen>
              )}
            </div>
          ]
        )}
      </div>
    );
  }
}
