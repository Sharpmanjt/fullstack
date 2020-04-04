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
      sort : 'Id',
      prevData : []
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

  deleteRoom = async (room = null) => {
    if(room._id){
      console.log("Called with id: "+room._id);
      const response =  await axios.post("http://localhost:5000/api/rooms/delete",{id:room._id});
      console.log("Response: "+JSON.stringify(response));
      this.getTableData('rooms');
    }
  }

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
    let length = value.length; //Gets the length of the value in the textbox
    /*------------------
      If the table is not populated with the initial dataset
    /* */
    if(this.state.prevData.length != 0){
      this.getTableData("eventHistory")
      if(length == 0){ //If the value passed is empty then we want to fetch the initial data
        return;
      }     
    }

    /*-------------------
      Filter the dataset based on the input passed
    /* */

    let newData = []
    for(let index in this.state.data){
      if(typeof this.state.data[index] == "object"){
        for(let obj in this.state.data[index]){
          if(obj == "_id" && this.state.data[index][obj].substring(0,length) == value){  
            this.setState({prevData:this.state.data});
            newData.push(this.state.data[index])
            this.setState({data:newData})
          }
        }
      }
    }
  }

  sort = (value) => {
    console.log("Sorting: "+value);
    this.setState({sort:value});
    let newData = [];
    for(let index in this.state.data){
      if(typeof this.state.data[index] == "object"){
          switch(value){
            case "Id":
              //"_id"
              newData = this.state.data.sort((a,b)=>{
                return (a['_id']>b['_id']) ? 1:-1
              })
              console.log(JSON.stringify(newData));
              this.setState({data:newData});
              break;
            case "Type":
              //"type"
              newData = this.state.data.sort((a,b)=>{
                return (a['type']>b['type']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Date":
              //date
              newData = this.state.data.sort((a,b)=>{
                return (a['date']>b['date']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Time":
              //time
              newData = this.state.data.sort((a,b)=>{
                return (a['time']>b['time']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "User":
              //user
              newData = this.state.data.sort((a,b)=>{
                return (a['user']>b['user']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "PPID":
              //ppid
              newData = this.state.data.sort((a,b)=>{
                return (a['ppid']>b['ppid']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Sender":
              newData = this.state.data.sort((a,b)=>{
                return (a['sender']>b['sender']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Receiver":
              newData = this.state.data.sort((a,b)=>{
                return (a['receiver']>b['receiver']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Message":
              newData = this.state.data.sort((a,b)=>{
                return (a['message']>b['message']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Room":
              newData = this.state.data.sort((a,b)=>{
                return (a['room']>b['room']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Date Created":
              newData = this.state.data.sort((a,b)=>{
                return (a['dateCreated']>b['dateCreated']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Date Edited":
              newData = this.state.data.sort((a,b)=>{
                return (a['dateEdited']>b['dateEdited']) ? 1:-1
              })
              this.setState({data:newData});
              break;
            case "Status":
              newData = this.state.data.sort((a,b)=>{
                return (a['status']>b['status']) ? 1:-1
              })
              this.setState({data:newData});
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
 
        </div>
        <div className="table-div">
        <DataTable
            tableColumns={this.state.tableColumns}
            data={currentPosts}
            key={this.state.data}
            openDialog={this.openDialog}
            showRoomTable={this.state.showRoomTable}
            sort={this.sort}
            deleteRoom = {this.deleteRoom}
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