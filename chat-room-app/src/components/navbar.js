import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

export default class Navbar extends Component {
  constructor(props) {
    /* ------------------------------------
      It will check if the user has been authenticated and it will change
      the value of the log button according to that
    /* ------------------------------------ */
    super(props);
    let signed = localStorage.getItem("signed");
    this.state = {
      isAdminLoggedIn: signed,
      reload:false
    };

  }

  adminLogin = () => {
    this.props.adminLogin()
  };

  adminLogout = () => {
    this.props.adminLogout()
  };

  /*componentDidUpdate(prevProps) {
    this.setState({
      isAdminLoggedIn:this.props.isAdminLoggedIn
    })
  }*/
  
  isAdminLoggedIn(){
    let signed = localStorage.getItem("signed");
    return (signed == null ) ? false : true; 
  }

  setAdminLogged(){
    let signed = localStorage.getItem("signed");
    this.setState({
      isAdminLoggedIn:signed
    })
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <img src="../../cat-logo-lrg.png" alt="Cat Logo" className="img-logo"/>
            <Typography variant="h6" className="title">
              CHATTY CHAT
            </Typography>
            {this.props.isAdminLoggedIn ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.adminLogout}
              >
                Admin Logout
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.adminLogin}
              >
                Admin Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
