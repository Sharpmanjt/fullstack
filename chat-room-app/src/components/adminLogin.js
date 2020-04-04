import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {BrowserRouter as Router,Route,
  Redirect,Switch} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import App from "../App";

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
    }

    if (!this.validateInput(this.state.password)){
      this.setState({
        passwordErrorText: "Password Required"
      });
      return false;
    }
    return true;
  }

  handleLogin = async (e) => {
    e.preventDefault();
    if (this.authorizeUser(this.state.username, this.state.password))
    {
      const response = await axios.post(
       'http://localhost:5000/api/login',
       {username : this.state.username,
        password : this.state.password },
       { headers: {'Content-Type':'application/json'}}
      )
      if(response.data.status === 404){
        if(response.data.message === 'User does not exist'){
          this.setState({
            usernameErrorText: response.data.message
          })
        }else{
          this.setState({
            passwordErrorText: response.data.message
          })
        }
        return false;
      }else{
        const token = response.data.token;
        localStorage.setItem('jwtToken',token);
        localStorage.setItem('signed',true);
        let app = new App();
        app.authSucess();
      }

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
