import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DataTable from "./dataTable";
import RoomDialog from "./roomDialog";
import axios from "axios";
import UtilityFunctions from "../utilityFunctions";
import Pagination from './Pagination'
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

export default class AdminScreen extends Component {

  constructor(props) {

    super(props);
    this.state = {
      tableColumns: ["Id", "Type", "Date", "Time", "User", "PPID"],
      data: [],
      showRoomTable: false,
      showRoomDialog: false,
      currentRoom: null,
      currentPage : 1,
      setCurrentPage : 1,
      postPerPage : 5,
      setPostsPerPage : 5,
      refreshPagination: false,
      sort : 'Id'
    };
    this.getTableData("eventHistory");
  }

  showEventHistory = () => {
    this.setState({
      tableColumns: ["Id", "Type", "Date", "Time", "User", "PPID"],
      showRoomTable: false
    });
    this.getTableData("eventHistory");
  };

  refreshPagination() {
    this.setState({refreshPagination:!this.state.refreshPagination})
  }

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

  paginate(pageNumber){
    this.setState({currentPage:pageNumber})
  }

  filterTable(value){
    let length = value.length;
    let newData = []
    for(let index in this.state.data){
      if(typeof this.state.data[index] == "object"){
        for(let obj in this.state.data[index]){
          if(obj == "_id" && this.state.data[index][obj].substring(0,length) == value){
            newData.push(this.state.data[index])
            this.setState({data:newData});
          }
        }
      }
    }
  }

  sort(value){
    console.log("Sorting: "+value);
    this.setState({sort:value});
    let newData = [];
    for(let index in this.state.data){
      if(typeof this.state.data[index] == "object"){
        console.log(this.state.data[index]);
          switch(value){
            case "Id":
              //"_id"
              newData = this.state.data.sort((a,b)=>{
                return a['_id'] - b['_id'];
              })
              this.setState({data:newData});
              break;
            case "Type":
              //"type"
              break;
            case "Date":
              //date
              break;
            case "Time":
              //date
              break;
            case "User":
              //user
              break;
            case "PPID":
              //ppid
              break;
          }
        }
  }
}


  render() {
    const paginate = (pageNumber) => {
      this.setState({currentPage:pageNumber})
    }
    if(this.state.data.length > 0){
    const indexOfLastPost = this.state.currentPage * this.state.postPerPage;
    const indeOfFirstPost = indexOfLastPost - this.state.postPerPage;
    const currentPosts = this.state.data.slice(indeOfFirstPost, indexOfLastPost);
    const reload = 1+this.currentPosts;
    //sconsole.log(this.state.data);

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
        <div className="filter-box">
          <TextField
              id="filter-table"
              label="Search"
              onChange={e => this.filterTable(e.target.value) }
              variant="outlined"
              className="filter-table"
            ></TextField>
            <TextField
            id="sort"
            select
            label="Sort by"
            value={this.state.sort}
            onChange={(e) => this.sort(e.target.value)}
            variant="outlined"
            className="select-sort"
          >
            {this.state.tableColumns
              .map(column => (
                <MenuItem value={column} key={column}>
                  {column}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <div className="table-div">
        <DataTable
            tableColumns={this.state.tableColumns}
            data={currentPosts}
            key={this.state.data}
            openDialog={this.openDialog}
            showRoomTable={this.state.showRoomTable}
          ></DataTable> 
        </div>
        <div className="pagination-div">
          <Pagination postsPerPage={this.state.postPerPage} totalPosts={this.state.data.length} paginate={paginate} /> 
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
  }else{
    return null;
  }
}
}