const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const cors = require("cors");
const io = require("socket.io")(http);
const jwt = require("jsonwebtoken");
const config = require("./config");

var bodyParser = require("body-parser");
var process = require("process");

// models
let Event = require("./models/eventHistory");
let Chat = require("./models/chatHistory");
let Room = require("./models/room");
let User = require("./models/user");

let chatHistory = {}

// connecting to database
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const url =
  "mongodb://admin:admin@aliens-shard-00-00-eukpc.mongodb.net:27017,aliens-shard-00-01-eukpc.mongodb.net:27017,aliens-shard-00-02-eukpc.mongodb.net:27017/test?ssl=true&replicaSet=aliens-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose
  .connect(url, { userUnifiedTopology: true, useNewUrlParser: true })
  .then(
    () => {
      console.log("Database successfully connected");
    },
    error => {
      console.log("Database could not be connected: " + error);
    }
  );

// setting up app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "build")));

// create port
const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log("App listening on port " + port);
});

app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

let response = {
  message: '',
  data: '',
  status: '',
  token: 'should be a token'
}

// API routes
app.get("/api/eventHistory", function(req, res) {
  Event.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get event history.");
    } else {
      res.status(200).json(docs);
    }
  }).select("-_id, -__v");
});

app.get("/api/chatHistory", function(req, res) {
  Chat.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get chat history.");
    } else {
      res.status(200).json(docs);
    }
  }).select("-__v");
});

app.post("/api/login", function(req,res){
  response = {
    message: '',
    data: '',
    status: '',
    token: ''
  }
  let username = req.body.username;
  let password = req.body.password;
  User.find({ username: username }, function(err,docs){
    if (err) {
      handleError(res, err.message, "Failed to get chat history.");
    } else {
      if(docs.length == 0){
        response.message = 'User does not exist';
        response.status = 404;
        response.data = '';
      }
      else if(docs[0]["password"] != password){
        response.message = 'Password does not match';
        response.status = 404;
        response.data = '';
      }
      else{
        const token = jwt.sign({
          id: docs[0]["_id"],
          username: docs[0]["username"]
        }, config.token);
        response.token = token;
        response.message = 'Successfully authenticated';
        response.status = 200;
        response.data = docs;
      }
      res.status(200).json(response);
    }
  }).select("-__v");
})

app.use("/api/chatHistory/room", function(req, res) {
  let room = req.query.room;
  Chat.find({ room: room }, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get chat history.");
    } else {
      res.status(200).json(docs);
    }
  }).select("-__v");
});

app.get("/api/rooms", function(req, res) {
  Room.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get rooms.");
    } else {
      res.status(200).json(docs);
    }
  }).select("-__v");
});

app.use("/api/rooms/add", function(req, res) {
  let room = new Room(req.body);
  room
    .save()
    .then(room => {
      res.status(200).json("Room added successfully.");
    })
    .catch(err => {
      handleError(res, err.message, "Failed to add room.");
    });
});

app.use("/api/rooms/update", function(req, res) {
  let id = req.body._id;
  let room = req.body;
  Room.findByIdAndUpdate({ _id: id }, room, { useFindAndModify: false })
    .then(room => {
      res.status(200).json("Room updated successfully.");
    })
    .catch(err => {
      handleError(res, err.message, "Failed to add room.");
    });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

app.get("/*", function(req, res) {
  res.sendFile(__dirname + "/build/static/index.html");
});

// socket.io setup
io.on('connection', function(socket) {
  const { id } = socket.client;
  
  // console.log(`user connected: ${id}`);
  new Event({
    type: "CONNECT",
    date: getCurrentDate(),
    time: getCurrentTime(),
    user: "",
    ppid: process.pid
  }).save();

  socket.on('disconnect', function() {
    // console.log(`user disconnected: ${id}`)
    new Event({
      type: "DISCONNECT",
      date: getCurrentDate(),
      time: getCurrentTime(),
      user: "",
      ppid: process.pid
    }).save();
  });

  socket.on("join", ({ username, newRoom }) => {
    socket.join(newRoom);
    // console.log(`${username} joined: ${newRoom}`);
    new Event({
      type: "JOIN",
      date: getCurrentDate(),
      time: getCurrentTime(),
      user: username,
      ppid: process.pid
    }).save();
    let msg = `${username} has joined the chat`;
    io.to(newRoom).emit('notification',{msg,chatHistory});
    socket.broadcast.emit();
  });
  
  socket.on("leave", ({ username, currentRoom }) => {
    socket.leave(currentRoom);
    // console.log(`${username} left: ${currentRoom}`);
    new Event({
      type: "LEAVE",
      date: getCurrentDate(),
      time: getCurrentTime(),
      user: username,
      ppid: process.pid
    }).save();
    let msg = `${username} has left the chat`;
    io.to(currentRoom).emit('notification',{msg,chatHistory});
    socket.broadcast.emit();
  });

  socket.on("message", ({ username, msg, room, obj }) => {
    let added = false;
    for(let roomObj in chatHistory){
      if(roomObj == room){
        chatHistory[roomObj].push(obj[room][0]);
        added = true;
      }
    }
    if(!added){
      chatHistory[room] = obj[room];
    }
    console.log(JSON.stringify(chatHistory));
    // console.log(`${username} : ${msg} in ${room}`);
    new Chat({
      date: getCurrentDate(),
      time: getCurrentTime(),
      sender: username,
      receiver: "",
      message: msg,
      room: room
    }).save();
    io.to(room).emit('message', { username, msg, chatHistory });
    socket.broadcast.emit();
  });
});

// utility functions
function getCurrentDate() {
  return new Date(Date.now()).toLocaleDateString();
}

function getCurrentTime() {
  return new Date(Date.now()).toLocaleTimeString();
}
