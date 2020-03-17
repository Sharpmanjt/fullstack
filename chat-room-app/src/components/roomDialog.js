import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import UtilityFunctions from "../utilityFunctions";

export default class roomDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: this.props.room,
      roomName: this.props.room ? this.props.room.name : "",
      roomStatus: this.props.room ? this.props.room.status : "active",
      errorText: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        room: this.props.room,
        roomName: this.props.room ? this.props.room.name : "",
        roomStatus: this.props.room ? this.props.room.status : "active"
      });
    }
  }

  handleClose = () => {
    this.setState({
      errorText: ""
    });
    this.props.closeDialog();
  };

  handleSave = () => {
    if (this.state.roomName.length === 0) {
      this.setState({
        errorText: "Room Name Required"
      });
    } else {
      this.setState({
        errorText: ""
      });
      let room = { ...this.state.room };
      room.name = this.state.roomName;
      room.status = this.state.roomStatus;
      room.dateEdited = UtilityFunctions.getCurrentDate();
      this.props.saveRoom(room);
    }
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.showRoomDialog}
          onClose={this.handleClose}
          className="room-dialog"
          fullWidth={true}
          maxWidth={"xs"}
        >
          <DialogTitle>
            {this.state.room ? "Edit Room" : "Add Room"}
          </DialogTitle>
          <div className="room-dialog-content">
            <DialogContent>
              <TextField
                required
                id="roomName"
                label="Name"
                name="roomName"
                value={this.state.roomName}
                onChange={this.handleInputChange}
                variant="outlined"
                className="room-dialog-name"
                error={this.state.errorText.length === 0 ? false : true}
                helperText={this.state.errorText}
              />
              <br></br>
              <TextField
                id="roomStatus"
                name="roomStatus"
                select
                label="Status"
                value={this.state.roomStatus}
                onChange={this.handleInputChange}
                variant="outlined"
                className="room-dialog-status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions className="button-div">
              <Button onClick={this.handleSave} color="primary">
                Save
              </Button>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </div>
    );
  }
}
