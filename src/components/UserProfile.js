import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from "axios";
import * as bootstrap from "react-bootstrap"
import {Image, Button, Modal, Card} from "react-bootstrap"
// import HeartClick from "./HeartClick"
import "./Tweets.css"
import CommentsShow from "./CommentsShow"

class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            alltweets: [],
            tweets: [],
            exactTweet:[],
            user: {},
            show1:false,
            modalcomments:[],
            modalcommentsuser:"",
            modaltweetsid:""
        }
    }

    handleClose1 = () => {
        this.setState({show1:false});
    }
    handleShow1 = (comments, user, tweetid) => {
        this.setState({show1:true, modalcomments:comments, modalcommentsuser:user, modaltweetsid:tweetid});
    }
    
    async componentDidMount() {
        if(localStorage.getItem("name") === ""){
            this.props.history.push("/")
        }
        else{
        
        await axios("http://localhost:8082/getusers").then(res => 
            this.setState( {tweets: res.data, alltweets: res.data })
        ); 
        let currentdata = this.state.alltweets
        let exactTweet = []
        for(let i = 0; i < currentdata.length; i++){
            let mainid = currentdata[i]._id
            let user = currentdata[i].user
            let name = currentdata[i].name
            let profilepic = currentdata[i].profilepic
            let currenttweet = currentdata[i].tweets
            for(let j = 0; j < currenttweet.length; j++){
                let id = currenttweet[j]._id
                let sno = currenttweet[j].sno
                let content = currenttweet[j].content
                let createdAt = currenttweet[j].createdAt
                let likes = currenttweet[j].likes
                let comments = currenttweet[j].comments
                let exactTweets = {}
                exactTweets.mainid = mainid
                exactTweets.id = id
                exactTweets.sno = sno
                exactTweets.content = content
                exactTweets.createdAt = createdAt
                exactTweets.user = user 
                exactTweets.name = name
                exactTweets.profilepic = profilepic
                exactTweets.likes = likes
                exactTweets.comments = comments
                exactTweet.push(exactTweets)
            }
        }
        this.setState({ exactTweet })
        let flag = false
        let checktweet = this.state.tweets
        for(let i = 0; i < checktweet.length; i++){
            if(localStorage.getItem("profilename") === checktweet[i].user){
                flag = true;
                break;
            }
        }
        if (flag){
        const posts = this.state.tweets.filter(item => item.user === localStorage.getItem("profilename"));
        const tweets = posts[0].tweets
        this.setState({ user:posts[0], tweets });
        if (this.state.user.user === localStorage.getItem("user")){
            this.props.history.push("/myprofile");
        }
        }
        else{
            this.setState({ tweets: [], user: [] })
        }
    }
    }
    handleLogout = () => {
        localStorage.setItem("name", "")
        this.props.history.push("/")
    }
    
    checkSrc = (name, src) =>{
        if(name==="Jas" || name==="Felix" || name==="Jatin"){
            return `/${name}.png`
        }
        else{
            if(src){
                return src
            }
            else{
               return "https://p.kindpng.com/picc/s/99-997900_headshot-silhouette-person-placeholder-hd-png-download.png"
            }
        }
    }
    handleProfileVisit = (e,name) => {
        e.persist();
        localStorage.setItem("profilename", name);
        this.props.history.push("/userprofile");
    } 
    commentPic = (username) =>{
        let tweets = this.state.alltweets
        let pic = ""
        for(let i = 0; i < tweets.length; i++){
            if(tweets[i].user === username){
                pic = tweets[i].profilepic
            }
        }
        return pic
    }
    handleCommentLength = (comments) => {
        if (comments){
        let val = parseInt(comments.length)
        if (val > 0){
        return (val)
        }
        else 
        return ""
    }
    }
    render() {
        return (
            <bootstrap.Container>
                <bootstrap.Navbar style={{position: "fixed",top: "0",zIndex:"1",width:"60.6%", border: "2px solid white"}} bg="dark" variant="dark">
                 <bootstrap.Navbar.Brand title="Go to Your profile"><img alt="Twitter Logo" height="25" width="25" src={"TwitterLogo.png"} /> &nbsp;Welcome, <strong>{localStorage.getItem("name")}</strong>!</bootstrap.Navbar.Brand>
                <bootstrap.Nav className="mr-auto">
                            <bootstrap.Nav.Link href="/tweets">Go Back</bootstrap.Nav.Link>
                            <bootstrap.Nav.Link href="#" onClick={this.handleLogout}>Logout</bootstrap.Nav.Link>
                </bootstrap.Nav>
                </bootstrap.Navbar>
                 <bootstrap.Jumbotron fluid style={{backgroundColor:"#232733", marginTop: "50px", border: "2px solid white", padding:"22px"}}>
                 {this.state.user.length === 0 ? (
                    <center><br/> <p>User Doesn't Exist!</p> </center>
                    
                ) : (
                    <div>
                <div style={{display: "flex",justifyContent: "center", padding:"28px"}}>
                            <Card border="primary" className="bg-dark text-white" >
                            <Card.Body>
                            <Image
                             style={{marginRight:"70px"}}
                             src={this.checkSrc(this.state.user.user,this.state.user.profilepic)}
                             alt={this.state.user.user}
                             width="100"
                             height="100"
                             roundedCircle
                             />
                                <Card.Title><h4 style={{color:"white"}}><strong>{this.state.user.name}</strong></h4></Card.Title>
                                <Card.Text>
                                <p style={{color:"white"}}>@{this.state.user.user}</p>
                            <p style={{color:"white"}}>Age: {this.state.user.age}</p>
                            <p style={{color:"white"}}>Gender: {this.state.user.gender}</p>
                            <p style={{color:"white"}}>Bio: {this.state.user.bio}</p>
                            <p style={{color:"white"}}>Location: {this.state.user.location}</p>
                            <p style={{color:"white"}}>Account Created on: {this.state.user.accountCreated}</p>
                            <a target="_blank" rel="noreferrer" style={{color:"white"}} href={this.state.user.social}>Social Link</a><br/><br/>
                                </Card.Text>
                            </Card.Body>
                            </Card>
                            </div>

               
                {this.state.tweets.length === 0 ? (
                    
                    <center><br/> <p>No Tweets to Show!</p> </center>
                ) : (
                    <div>
                        <hr/>
                        <center><h3 style={{color:"white"}}>Tweets</h3></center>
                    <bootstrap.Row style={{display: "flex",justifyContent: "center"}}>                  
                        <center>
                    <bootstrap.Col >
                    {this.state.tweets.map(tweet => (
                        <bootstrap.Row style={{border: "2px solid white", padding:"22px"}} key={tweet._id} className="m-4 p-4 inline-flex border-2 border-black bg-gray-400" width="400">
                            <div className="col-sm-4">
                            <div className="cofounder-ceo-image">
                             <Image
                             className="rounded-full"
                             style={{marginRight:"70px"}}
                             src={this.checkSrc(this.state.user.user,this.state.user.profilepic)}
                             alt={this.state.user.user}
                             width="100"
                             height="100"
                             roundedCircle
                             />
                             </div>
                             </div>
                             <div className="col-sm-8">
                             <p style={{marginLeft: "-45px"}}><strong>{this.state.user.name}</strong> &nbsp;  @{this.state.user.user} &nbsp;·&nbsp;  {tweet.createdAt}</p>
                                    <h4>{tweet.content}</h4>
                                    <br/>
                                    <h5>❤️ {tweet.likes} likes</h5>
                                    <h5 >💭 {this.handleCommentLength(tweet.comments)} </h5>
                                    <h5 title="See Comments" onClick={e => this.handleShow1(tweet.comments, tweet.user, tweet._id)} >Show comments </h5>
                                    <Modal show={this.state.show1} onHide={this.handleClose1} size="lg" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
                                    <Modal.Header closeButton style={{backgroundColor:"#212020"}}>
                                    <Modal.Title style={{color:"white"}}>Comments</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{backgroundColor:"#232733"}}>
                                    <div>
                                    
                                    <CommentsShow comments={this.state.modalcomments} user={this.state.modalcommentsuser} tweetid={this.state.modaltweetsid} exactTweet={this.state.exactTweet}/>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer style={{backgroundColor:"#212020"}}>
                                    <Button variant="secondary" onClick={this.handleClose1}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                    </Modal>
                                    </div>
                          
                        </bootstrap.Row> 
                       
                    ))}
                     </bootstrap.Col>
                     </center>
                    </bootstrap.Row>
                    </div>
                )}
                </div>
                )}
                </bootstrap.Jumbotron>
            </bootstrap.Container>
        );
    }
}

export default withRouter(UserProfile);