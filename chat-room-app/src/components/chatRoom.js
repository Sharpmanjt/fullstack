import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  render() {
    return (
      <div>
        <Paper elevation={3} className="chat-container"></Paper>
        <Paper elevation={3} className="message-container">
          <TextField
            id="message"
            // label="Username"
            // value={this.state.username}
            onChange={e => this.setState({ message: e.target.value })}
            variant="outlined"
            className="message"
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            className="message-button"
            // onClick={e => this.handleSubmit(e)}
          >
            Send
          </Button>
        </Paper>
      </div>
    );
  }
}
