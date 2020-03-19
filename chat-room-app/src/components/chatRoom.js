import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      chat: this.props.chat
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chat !== this.props.chat) {
      this.setState({
        chat: this.props.chat,
        // room: this.props.room
      });
    }
  }

  renderChat = () => {
    return this.state.chat.map(({ username, msg }) => (
      <div className="chat">
        {username !== "" ? (
          <div>
            <span className="chat-username">{username}    </span>
            <span className="chat-message">{msg}</span>
          </div>
        ) : (
          <span className="chat-message">
            <i>{msg}</i>
          </span>
        )}
      </div>
    ));
  };

  handleSend = () => {
    this.props.handleSend(this.state.message);
    this.setState({ message: "" });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') this.handleSend();
  }

  render() {
    return (
      <div>
        <Paper elevation={3} className="chat-container">
          <div className="chat-box">{this.renderChat()}</div>
        </Paper>
        <Paper elevation={3} className="message-container">
          <TextField
            label="Message"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
            onKeyPress={this.handleKeyPress}
            variant="outlined"
            className="message"
            disabled={!this.props.room}
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            className="message-button"
            onClick={this.handleSend}
            disabled={!this.props.room}
          >
            Send
          </Button>
        </Paper>
      </div>
    );
  }
}
