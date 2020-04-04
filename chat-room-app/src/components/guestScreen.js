import React, { Component } from "react";
import ChatRoom from "./chatRoom";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import io from "socket.io-client";

export default class GuestScreen extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect("http://localhost:5000");
    this.state = {
      username: "",
      room: "",
      rooms: [],
      chat: [],
      showHistory:false,  
      history : [],
      chatHistory : {},
      showHistoryFor:''
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

    this.socket.on("message", ({ username, msg, chatHistory, showHistoryFor }) => {
      let statusCopy = Object.assign({},this.state);
      statusCopy["chatHistory"] = chatHistory;
      statusCopy["history"] = chatHistory[this.state.room];
      statusCopy["chat"] = [...this.state.chat,{ username, msg }]
      statusCopy["showHistory"] = showHistoryFor;

      this.setState(statusCopy);
      setTimeout(()=>{
        console.log(JSON.stringify(this.state))
      },200)
    });

    this.socket.on("notification", ({username,msg,chatHistory,showHistory}) => {
      const user = username;
      let statusCopy = Object.assign({},this.state);
      statusCopy["chatHistory"] = chatHistory;
      statusCopy["history"] = chatHistory[this.state.room];
      statusCopy["chat"] = [...this.state.chat,{ user, msg }]

      if(showHistory == undefined || showHistory == 'undefined'){
        statusCopy["showHistory"] = false;
      }else{
        statusCopy["showHistory"] = true;
      }

      this.setState(statusCopy);
      setTimeout(()=>{
        console.log(JSON.stringify(this.state))
      },200)
    });

    this.socket.on("setGuest", ({username})=>{
      if(this.state.username === ''){
        this.setState({username:username});
      }
    })
  }

  onChangeRoom = (e) => {
    const username = this.state.username ? this.state.username : 'guest';
    const currentRoom = this.state.room;
    if (currentRoom !== "") this.props.socket.emit("leave", { username, currentRoom });
    this.setState({ room: e.target.value, chat: [] });
    const newRoom = e.target.value;
    this.socket.emit("join", { username, newRoom });
  };

  onMessageSent = msg => {
    this.setState({newUser:false})
    let list = []
    list.push(this.state.username + " "+ msg);
    let room = this.state.room;
    let obj = {};
    obj[room] = list;
    console.log(obj[room]);

    const username = this.state.username ? this.state.username : 'guest';
    this.socket.emit("message", { username, msg, room, obj });
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
        <ChatRoom showHistoryFor={this.state.showHistoryFor} history={this.state.history} username={this.state.username} showHistory={this.state.showHistory} newUser={this.state.newUser} socket={this.props.socket} chat={this.state.chat} handleSend={this.onMessageSent} room={this.state.room}></ChatRoom>
      </div>
    );
  }
}
