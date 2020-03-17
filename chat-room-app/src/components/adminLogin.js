import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

export default class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameErrorText: "",
      passwordErrorText: ""
    };
  }

  validateInput = (input) => {
    return input.length > 0;
  }

  authorizeUser = (username, password) => {
    if (!this.validateInput(this.state.username)){
      this.setState({
        usernameErrorText: "Username Required"
      });
      return false;
    } else if (username !== "admin") {
      this.setState({
        usernameErrorText: "Username does not exist"
      });
      return false;
    }

    if (!this.validateInput(this.state.password)){
      this.setState({
        passwordErrorText: "Password Required"
      });
      return false;
    } else if (password !== "password") {
      this.setState({
        passwordErrorText: "Password does not match"
      });
      return false;
    }
    return true;
  }

  handleLogin = (e) => {
    e.preventDefault();
    if (this.authorizeUser(this.state.username, this.state.password))
    {
      this.props.setAdminLoggedIn(true);
      this.props.setLoggingIn(false);
    }
  };

  render() {
    return (
      <div className="login-container">
        <Paper elevation={3} className="login-container">
          <form autoComplete="off">
            <TextField
              id="username"
              required
              label="Username"
              onChange={e => this.setState({ username: e.target.value, usernameErrorText: '' })}
              variant="outlined"
              error={this.state.usernameErrorText.length === 0 ? false : true}
              helperText={this.state.usernameErrorText}
            />
            <br></br>
            <TextField
              id="password"
              required
              label="Password"
              onChange={e => this.setState({ password: e.target.value, passwordErrorText: '' })}
              type="password"
              variant="outlined"
              error={this.state.passwordErrorText.length === 0 ? false : true}
              helperText={this.state.passwordErrorText}
            />
            <br></br>
            <Button
              variant="contained"
              color="primary"
              onClick={e => this.handleLogin(e)}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={() => {this.props.handleCancel()}}
            >
              Cancel
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}
