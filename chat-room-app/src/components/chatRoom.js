import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : this.props.username,
      message: "",
      chat: this.props.chat,
      lastChats: [],
      chatsDisplayed: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chat !== this.props.chat) {
      this.setState({
        chat: this.props.chat,
        lastChats:this.props.history,
        chatsDisplayed: this.props.newUser,
        username:this.props.showHistoryFor
        // room: this.props.room
      });
    }
    console.log("Username is: "+this.props.username)
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
            

            {this.state.lastChats != undefined ?(
            <div>
               {this.state.lastChats.map(chat=>{
                let text = chat.split(" ");
                let message = chat.substr(text[0].length,chat.length)
                if((text[0] != this.props.username && this.props.showHistory == true) || this.props.username == this.state.username){//this.setState({chatsDisplayed:false});
                  console.log('Username from props: '+this.props.username);
                  console.log('Username stored: '+ this.state.username);
                  this.state.username = this.props.username;
                  return <div> <span className="chat-username">{text[0]}    </span><span className="chat-message">{message}</span><br/><br/></div>
                }})}
            
              </div>
            ):(
              <div></div>
            )}
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

/* TODO:
    1. Find a way to store the username on the chat history so i can identify the different isers that sent the messages
*/
