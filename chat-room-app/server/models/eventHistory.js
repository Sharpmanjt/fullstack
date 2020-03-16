var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let eventHistorySchema = new Schema({
    type: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    user: {
        type: String
    }, 
    ppid: {
        type: Number
    }
}, {
    collection: 'eventHistory'
})

module.exports = mongoose.model('Event', eventHistorySchema);
