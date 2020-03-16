var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let roomSchema = new Schema({
    id: {
        type: String
    },
    room: {
        type: String
    },
    dateCreated: {
        type: String
    },
    dateEdited: {
        type: String
    }, 
    status: {
        type: String
    }
}, {
    collection: 'rooms'
})

module.exports = mongoose.model('Room', roomSchema);
