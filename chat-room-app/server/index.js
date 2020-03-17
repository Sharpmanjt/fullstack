const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const cors = require("cors");
const io = require("socket.io")(http);

var bodyParser = require("body-parser");
var process = require("process");

// models
let Event = require("./models/eventHistory");
let Chat = require("./models/chatHistory");
let Room = require("./models/room");

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

// API routes
app.get("/api/eventHistory", function(req, res) {
  Event.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get event history.");
    } else {
      res.status(200).json(docs);
    }
  }).select("-__v");
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
io.on("connection", socket => {
  new Event({
    type: "CONNECTION",
    date: getCurrentDate(),
    time: getCurrentTime(),
    user: "",
    ppid: process.pid
  }).save();
});

// utility functions
function getCurrentDate() {
  return new Date(Date.now()).toLocaleDateString();
}

function getCurrentTime() {
  return new Date(Date.now()).toLocaleTimeString();
}
