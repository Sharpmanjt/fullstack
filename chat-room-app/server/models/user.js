var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type:String
    },
    password:{
        type:String
    }
},{
    collection: 'admins'
})

module.exports = mongoose.model('User',userSchema);