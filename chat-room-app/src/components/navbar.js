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
    console.log("Update called-1");
    this.setState({
      isAdminLoggedIn:this.props.isAdminLoggedIn
    })
  }*/

  


  isAdminLoggedIn(){
    let signed = localStorage.getItem("signed");
    console.log("Signed: "+signed);
    return (signed == null ) ? false : true; 
  }

  setAdminLogged(){
    let signed = localStorage.getItem("signed");
    console.log("set called: "+signed);
    this.setState({
      isAdminLoggedIn:signed
    })
  }

  render() {
    let signed = (localStorage.getItem("signed") == null) ? false : true
    console.log("Setting signed on render with value: "+signed);
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <img src="../../cat-logo-lrg.png" alt="Cat Logo" className="img-logo"/>
            <Typography variant="h6" className="title">
              CHATTY CHAT
            </Typography>
            {signed ? (
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
