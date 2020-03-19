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
      chat: []
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

    this.props.socket.on("message", ({ username, msg }) => {
      this.setState({
        chat: [...this.state.chat, { username, msg }]
      });
    });

    this.props.socket.on("notification", msg => {
      const username = '';
      this.setState({
        chat: [...this.state.chat, {username, msg}]
      });
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
    const username = this.state.username ? this.state.username : 'Anonymous';
    const room = this.state.room;
    this.props.socket.emit("message", { username, msg, room });
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
        <ChatRoom socket={this.props.socket} chat={this.state.chat} handleSend={this.onMessageSent} room={this.state.room}></ChatRoom>
      </div>
    );
  }
}
