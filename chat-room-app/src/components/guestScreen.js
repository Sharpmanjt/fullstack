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
      rooms: []
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
  }

  render() {
    return (
      <div>
        <div className="guest-input-container">
          <TextField
            id="username"
            label="Username"
            onChange={e => this.setState({ username: e.target.value })}
            variant="outlined"
            className="add-username"
          ></TextField>
          <TextField
            id="room"
            select
            label="Chat Room"
            value={this.state.room}
            onChange={e => this.setState({ room: e.target.value })}
            variant="outlined"
            className="select-room"
          >
            {this.state.rooms.map(room => (
              <MenuItem value={room.room}>{room.room}</MenuItem>
            ))}
          </TextField>
        </div>
        <ChatRoom></ChatRoom>
      </div>
    );
  }
}
