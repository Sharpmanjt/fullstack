import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

export default class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleSubmit = e => {
    e.preventDefault();
    if (
      this.validateForm() &&
      this.state.username === "admin" &&
      this.state.password === "password"
    ) {
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
              label="Username"
              onChange={e => this.setState({ username: e.target.value })}
              variant="outlined"
            />
            <br></br>
            <TextField
              id="password"
              label="Password"
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
              variant="outlined"
            />
            <br></br>
            <Button
              variant="contained"
              color="primary"
              onClick={e => this.handleSubmit(e)}
            >
              Login
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}
