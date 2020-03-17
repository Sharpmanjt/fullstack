import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DataTable from "./dataTable";
import RoomDialog from "./roomDialog";
import axios from "axios";
import UtilityFunctions from "../utilityFunctions";

export default class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableColumns: ["Type", "Date", "Time", "User", "EventID", "PPID"],
      data: [],
      showRoomTable: false,
      showRoomDialog: false,
      currentRoom: null
    };
    this.getTableData("eventHistory");
  }

  showEventHistory = () => {
    this.setState({
      tableColumns: ["Type", "Date", "Time", "User", "EventID", "PPID"],
      showRoomTable: false
    });
    this.getTableData("eventHistory");
  };

  showChatHistory = () => {
    this.setState({
      tableColumns: [
        "Id",
        "Date",
        "Time",
        "Sender",
        "Receiver",
        "Message",
        "Room"
      ],
      showRoomTable: false
    });
    this.getTableData("chatHistory");
  };

  showRooms = () => {
    this.setState({
      tableColumns: [
        "Id",
        "Name",
        "Date Created",
        "Date Edited",
        "Status",
        "Action"
      ],
      showRoomTable: true
    });
    this.getTableData("rooms");
  };

  getTableData = collection => {
    axios
      .get("http://localhost:5000/api/" + collection)
      .then(response => {
        this.setState({
          data: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  openDialog = (room = null) => {
    this.setState({
      showRoomDialog: true,
      currentRoom: room
    });
  };

  closeDialog = () => {
    this.setState({
      showRoomDialog: false,
      currentRoom: null
    });
  };

  saveRoom = (room) => {
    if (room._id) {
      axios.post("http://localhost:5000/api/rooms/update", room);
    } else {
      const newRoom = {
        name: room.name,
        dateCreated: UtilityFunctions.getCurrentDate(),
        dateEdited: UtilityFunctions.getCurrentDate(),
        status: room.status
      };
      axios.post("http://localhost:5000/api/rooms/add", newRoom);
    }
    this.setState({
      showRoomDialog: false,
      currentRoom: null
    });
    this.getTableData("rooms");
  };

  render() {
    return (
      <div>
        <div className="button-div">
          <ButtonGroup
            variant="text"
            color="primary"
            aria-label="text primary button group"
          >
            <Button onClick={this.showEventHistory}>Event History</Button>
            <Button onClick={this.showChatHistory}>Chat History</Button>
            <Button onClick={this.showRooms}>Rooms</Button>
          </ButtonGroup>
        </div>
        <div className="table-div">
          <DataTable
            tableColumns={this.state.tableColumns}
            data={this.state.data}
            key={this.state.data}
            openDialog={this.openDialog}
            showRoomTable={this.state.showRoomTable}
          ></DataTable>
        </div>
        <RoomDialog
          showRoomDialog={this.state.showRoomDialog}
          closeDialog={this.closeDialog}
          saveRoom={this.saveRoom}
          room={this.state.currentRoom}
        ></RoomDialog>
        <div className="room-button">
          {this.state.showRoomTable && (
            <Button variant="contained" onClick={() => this.openDialog(null)}>
              Add Room
            </Button>
          )}
        </div>
      </div>
    );
  }
}
