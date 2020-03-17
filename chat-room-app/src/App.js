import React, { Component } from "react";
import "./App.css";
import Navbar from "../src/components/navbar";
import AdminLogin from "../src/components/adminLogin";
import AdminScreen from "./components/adminScreen";
import GuestScreen from "../src/components/guestScreen";

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

  render() {
    return (
      <div>
        {this.state.loggingIn ? (
          <AdminLogin
            setAdminLoggedIn={this.setAdminLoggedIn}
            setLoggingIn={this.setLoggingIn}
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
                <GuestScreen></GuestScreen>
              )}
            </div>
          ]
        )}
      </div>
    );
  }
}
