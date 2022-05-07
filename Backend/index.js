require("dotenv").config();
let MONGO_URL = process.env.MONGO_LINK
var express = require('express')
var cors = require('cors')
var mongoose = require('mongoose')

var UserModel = require("./src/models/User")

var app = express()

app.use(cors());

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.once('open', ()=>{
    console.log('Mongoose Connected!')
}).on('error', (error)=>{
    console.log("Error is:", error)
})

app.use(express.json())

app.get('/getusers', async (req, res)=>{
    let tweets = await UserModel.find({})

    console.log(tweets)

    res.send(tweets)
})

app.get('/getuser/:user', async (req, res)=>{
    let tweets = await UserModel.find({ user:req.params.user })
    console.log(tweets)
    res.send(tweets)
})

app.post('/newuser', async (req, res)=>{
    console.log("REQ Body: ", req.body)

    let { user, name, email, password, age, gender, social, bio, location, profilepic } = req.body

    let newUser = new UserModel({
        user,
        name,
        email,
        password,
        age,
        gender,
        social,
        bio,
        location,
        profilepic
    })

    let newObject = await newUser.save()

    res.send(newObject)
})

app.patch('/newtweet/:user', async (req, res)=>{
    console.log("REQ Body: ", req.body)
     try {
		const post = await UserModel.findOne({ user: req.params.user })
		if (req.body.content) {
			post.tweets.push(req.body)
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})
app.patch('/deletetweet/:mainid/:id', async (req, res)=>{
     try {
        const post = await UserModel.findOne({ _id: req.params.mainid})
        post.tweets = post.tweets.filter(item => item._id != req.params.id)
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

app.patch('/deletecomment/:user/:tweetid/:commentid', async (req, res)=>{
    try {
       const post = await UserModel.findOne({ user: req.params.user})
       console.log("bc 1")
       let arr = post.tweets
        for(let i = 0; i < arr.length; i++){
            console.log("bc 2")
            if(arr[i]._id == req.params.tweetid){
                console.log("bc 3")
                arr[i].comments = arr[i].comments.filter(item => item._id != req.params.commentid)
            }
            post.tweet
        }
        post.tweets = arr
       await post.save()
       res.send(post)
   } catch {
       res.status(404)
       res.send({ error: "Post doesn't exist!" })
   }
})

app.patch('/updatetweet/:mainid/:id', async (req, res)=>{
    try {
        const post = await UserModel.findOne({ _id: req.params.mainid})
		if (req.body.content) {
            let arr = post.tweets
            for(let i = 0; i < arr.length; i++){
                if(arr[i]._id == req.params.id){
                    arr[i].content = req.body.content
                    break;
                }
            }
			post.tweets = arr
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

app.patch('/updatecomment/:user/:tweetid/:commentid', async (req, res)=>{
    try {
        const post = await UserModel.findOne({ user: req.params.user})
		if (req.body) {
            let arr = post.tweets
            for(let i = 0; i < arr.length; i++){
                if(arr[i]._id == req.params.tweetid){
                    let arr1 = arr[i].comments;
                    for(let j = 0; j < arr1.length; j++)
                        {
                            if(arr1[j]._id == req.params.commentid)
                            {
                                arr1[j].comment = req.body.comment
                                break;
                            }
                        }
                    arr[i].comments = arr1    
                }
            }
			post.tweets = arr
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

app.patch('/newcomment/:mainid/:id', async (req, res)=>{
    console.log("REQ Body: ", req.body)
     try {
		const post = await UserModel.findOne({ _id: req.params.mainid })
		if (req.body) {
            let arr = post.tweets
            for(let i = 0; i < arr.length; i++){
                if(arr[i]._id == req.params.id){
                    arr[i].comments.push(req.body)
                    break;
                }
            }
            post.tweets = arr
			
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

app.patch('/updatedetails/:user', async (req, res)=>{
    UserModel.updateMany({ user: req.params.user}, req.body, {new: true}).then((blog) => {
        if (!blog) {
            return res.status(404).send();
        }
        if(req.body){
        res.send(blog);}
    }).catch((error) => {
        res.status(500).send(error);
    })

})

app.delete('/deleteuser/:user', async (req, res)=>{
    UserModel.deleteMany({ user: req.params.user}).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
})

app.patch('/updatelikes/:mainid/:id', async (req, res)=>{
    try {
        const post = await UserModel.findOne({ _id: req.params.mainid})
		if (req.body.likes) {
            let arr = post.tweets
            for(let i = 0; i < arr.length; i++){
                if(arr[i]._id == req.params.id){
                    arr[i].likes = req.body.likes
                    break;
                }
            }
			post.tweets = arr
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

app.listen(8082, ()=>{
    console.log('Server is running at 8082. ')
})
