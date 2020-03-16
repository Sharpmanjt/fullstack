import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DataTable from "./dataTable";
import RoomDialog from "./roomDialog";


export default class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableColumns: ["Type", "Date", "Time", "User", "EventID", "PPID"],
      showAddRoomButton: false,
      showRoomDialog: false,
      isNewRoom: true,
      roomName: "",
      roomStatus: "active"
    };
  }

  showEventHistory = () => {
    this.setState({
      tableColumns: ["Type", "Date", "Time", "User", "EventID", "PPID"],
      showAddRoomButton: false
    });
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
      showAddRoomButton: false
    });
  };

  showRooms = () => {
    this.setState({
      tableColumns: [
        "Id",
        "Room",
        "Date Created",
        "Date Edited",
        "Status",
        "Action"
      ],
      showAddRoomButton: true
    });
  };

  openDialog = () => {
    this.setState({
      showRoomDialog: true
    });
  };

  closeDialog = () => {
    this.setState({
      showRoomDialog: false
    });
  };

  submitDialog = () => {
    this.setState({
      showRoomDialog: false,
      roomName: "",
      roomStatus: "active"
    });
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
        <div className="room-button">
          {this.state.showAddRoomButton ? (
            <Button variant="contained" onClick={this.openDialog}>
              Add Room
            </Button>
          ) : (
            ""
          )}
        </div>
        <div className="table-div">
          <DataTable tableColumns={this.state.tableColumns}></DataTable>
        </div>
        <RoomDialog
          showRoomDialog={this.state.showRoomDialog}
          closeDialog={this.closeDialog}
          submitDialog={this.submitDialog}
          roomName={this.state.roomName}
          roomStatus={this.state.roomStatus}
          isNewRoom={this.state.isNewRoom}
        ></RoomDialog>
      </div>
    );
  }
}
