var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    tweets:[
        {
        content: String,
        createdAt: { type: String, default: new Date().toLocaleDateString('en-IN',{  hour: '2-digit', minute: '2-digit' }).toUpperCase()},
        likes: Number,
        sno:Number,
        comments:[
            {
                comment:"",
                commenter:"",
                commenterId:"",
                commentedAt: { type: String, default: new Date().toLocaleDateString('en-IN',{  hour: '2-digit', minute: '2-digit' }).toUpperCase()},
                commenterPic:""
            }
        ]
        }
        ],
    accountCreated: { type: String, default: new Date().toLocaleDateString('en-IN',{  hour: '2-digit', minute: '2-digit' }).toUpperCase() },
    user: String,
    name: String,
    email: String,
    password: String,
    age: String,
    gender: String,
    social: String,
    bio: String,
    location: String,
    profilepic:String
})

module.exports = mongoose.model("User", userSchema)