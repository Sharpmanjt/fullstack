var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let chatHistorySchema = new Schema({
    id: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    sender: {
        type: String
    }, 
    receiver: {
        type: String
    },
    message: {
        type: String
    },
    room: {
        type: String
    }
}, {
    collection: 'chatHistory'
})

module.exports = mongoose.model('Chat', chatHistorySchema);
