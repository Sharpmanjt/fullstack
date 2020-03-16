import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdminLoggedIn: this.props.isAdminLoggedIn
    };
  }

  adminLogin = () => {
    this.props.setLoggingIn(true);
  };

  adminLogout = () => {
    this.props.setAdminLoggedIn(false);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isAdminLoggedIn !== this.props.isAdminLoggedIn) {
      this.setState({
        isAdminLoggedIn: this.props.isAdminLoggedIn
      });
    }
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className="title">
              CHAT ROOM
            </Typography>
            {this.state.isAdminLoggedIn ? (
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
