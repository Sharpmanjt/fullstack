import React, { Component } from "react";
import ChatRoom from "./chatRoom";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";

export default class GuestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      room: "",
      rooms: [],
      chat: [],
      newUser:false,
      history : [],
      chatHistory : {}
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/rooms")
      .then(response => {
        this.setState({
          rooms: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    this.props.socket.on("message", ({ username, msg, chatHistory }) => {
      let statusCopy = Object.assign({},this.state);
      statusCopy["chatHistory"] = chatHistory;
      statusCopy["history"] = chatHistory[this.state.room];
      statusCopy["chat"] = [...this.state.chat,{ username, msg }]
      /*this.setState({
        chat: [...this.state.chat, { username, msg }]
      });*/
      this.setState(statusCopy);
      setTimeout(()=>{
        console.log(JSON.stringify(this.state))
      },200)
    });

    this.props.socket.on("notification", ({msg,chatHistory}) => {
      const username = '';
      let statusCopy = Object.assign({},this.state);
      statusCopy["chatHistory"] = chatHistory;
      statusCopy["history"] = chatHistory[this.state.room];
      statusCopy["chat"] = [...this.state.chat,{ username, msg }]
      statusCopy["newUser"] = true;

      this.setState(statusCopy);
      setTimeout(()=>{
        console.log(JSON.stringify(this.state))
      },200)
    });
  }

  onChangeRoom = (e) => {
    const username = this.state.username ? this.state.username : 'Anonymous';
    const currentRoom = this.state.room;
    if (currentRoom !== "") this.props.socket.emit("leave", { username, currentRoom });
    this.setState({ room: e.target.value, chat: [] });
    const newRoom = e.target.value;
    this.props.socket.emit("join", { username, newRoom });
  };

  onMessageSent = msg => {
    this.setState({newUser:false})
    let list = []
    list.push(this.state.username + " "+ msg);
    let room = this.state.room;
    let obj = {};
    obj[room] = list;
    console.log(obj[room]);

    const username = this.state.username ? this.state.username : 'Anonymous';
    this.props.socket.emit("message", { username, msg, room, obj });
    this.setState({ message: "" });
  };

  render() {
    return (
      <div>
        <div className="guest-input-container">
          <TextField
            id="username"
            label="Username"
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
            variant="outlined"
            className="add-username"
          ></TextField>
          <TextField
            id="room"
            select
            label="Chat Room"
            value={this.state.room}
            onChange={(e) => this.onChangeRoom(e)}
            variant="outlined"
            className="select-room"
          >
            {this.state.rooms
              .filter(room => room.status === "active")
              .map(room => (
                <MenuItem value={room.name} key={room.name}>
                  {room.name}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <ChatRoom history={this.state.history} username={this.state.username} newUser={this.state.newUser} socket={this.props.socket} chat={this.state.chat} handleSend={this.onMessageSent} room={this.state.room}></ChatRoom>
      </div>
    );
  }
}
