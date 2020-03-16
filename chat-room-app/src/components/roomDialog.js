import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";

export default class roomDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRoomDialog: this.props.showRoomDialog,
      isNewRoom: this.props.isNewRoom,
      roomName: this.props.roomName,
      roomStatus: this.props.roomStatus,
      errorText: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showRoomDialog !== this.props.showRoomDialog) {
      this.setState({
        showRoomDialog: this.props.showRoomDialog,
        roomName: this.props.roomName,
        roomStatus: this.props.roomStatus
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
      //room name is missing
      this.setState({
        errorText: "Room Name Required"
      });
    } else {
      //room name exists
      this.setState({
        errorText: ""
      });
      this.props.submitDialog();
    }
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.showRoomDialog}
          onClose={this.handleClose}
          className="room-dialog"
          fullWidth={true}
          maxWidth={"xs"}
        >
          <DialogTitle>
            {this.state.isNewRoom ? "Add Room" : "Edit Room"}
          </DialogTitle>
          <div className="room-dialog-content">
            <DialogContent>
              <TextField
                required
                id="roomName"
                label="Name"
                onChange={e => this.setState({ roomName: e.target.value })}
                variant="outlined"
                className="room-dialog-name"
                error={this.state.errorText.length === 0 ? false : true}
                helperText={this.state.errorText}
              />
              <br></br>
              <TextField
                id="roomStatus"
                select
                label="Status"
                value={this.state.roomStatus}
                onChange={e => this.setState({ roomStatus: e.target.value })}
                variant="outlined"
                className="room-dialog-status"
              >
                <MenuItem default value="active">
                  Active
                </MenuItem>
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
