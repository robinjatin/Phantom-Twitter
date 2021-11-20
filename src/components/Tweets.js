import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from "axios";
import * as bootstrap from "react-bootstrap"
import {Image, Modal, Button} from "react-bootstrap"
import "./Tweets.css"
import EditTweet from "./EditTweet"
import CommentsShow from "./CommentsShow"
import Comments from './Comments';
import NewTweet from './NewTweet';

class Tweets extends Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            flag: true,
            username:'',
            exactTweet: [{
                mainid:'',
                id:'',
                sno:0,
                content: '',
                createdAt: '',
                user: '',
                name: '',
                profilepic:''
            }],
            show: false,
            modalmainid:"",
            modalid:"",
            modalcontent:"",
            currentcontent: "",
            show1:false,
            modalcomments:[],
            modalcommentsuser:"",
            modaltweetsid:"",
            show2:false,
            modalnewcommentmainid:"",
            modalnewcommentid:"",
            show3:false,
            userssuggestions:[],
            suggestions: [],
            text: ''
        }
    }

    handleClose = () => {
        this.setState({show:false});
        window.location.reload(false)
    }
    handleShow = (mainid, id, content, e) => {
        this.setState({show:true, modalmainid:mainid, modalid:id, currentcontent:content});
    }

    handleClose1 = () => {
        this.setState({show1:false});
    }
    handleShow1 = (comments, user, tweetid) => {
        this.setState({show1:true, modalcomments:comments, modalcommentsuser:user, modaltweetsid:tweetid});
    }

    handleClose2 = () => {
        this.setState({show2:false});
        window.location.reload(false)
    }
    handleShow2 = (mainid, id) => {
        this.setState({show2:true, modalnewcommentmainid:mainid, modalnewcommentid:id});
    }

    handleClose3 = () => {
        this.setState({show3:false});
        window.location.reload(false)
    }
    handleShow3 = () => {
        this.setState({show3:true});
    }


    onTextChange = (e) => {
        const names = this.state.userssuggestions
        var uniqueNames = names.filter((value, index) => names.indexOf(value) === index)
        const value = e.target.value;
        let suggestions = [];
        if(value.length > 0){
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = uniqueNames.sort().filter(v => regex.test(v))
        }

        this.setState(() => ({
            suggestions,
            text: value,
            username:value
        }))
    }

    selectedText(value) {
        this.setState(() => ({
            text: value,
            username:value,
            suggestions: [],
        }))
    }

    renderSuggestions = () => {
        let { suggestions } = this.state;
        if(suggestions.length === 0){
            return null;
        }
        return (
            <ul>
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectedText(item)}>{item}</li>))
                }
            </ul>
        );
    }

    setContentChange = (val) => {
        this.setState({modalcontent:val})
    }
    handleDelete = (mainid, id, e) => {
        if(window.confirm("Do you really want to delete it?"))
        {
        axios.patch("http://localhost:8082/deletetweet/" + mainid + "/" + id).then(res =>
        console.log("Tweet deleted")).catch((error) => {
            console.log("Could not delete the tweet, error: ", error)
        });
        const posts = this.state.exactTweet.filter(item => item.id !== id);
        this.setState({ exactTweet:posts });
    }
    }
    handleUserSearch = () => {
        localStorage.setItem("usernamesearch", this.state.username)
        this.props.history.push("/usersearch");
    }
    async componentDidMount() {
        if(localStorage.getItem("name") === ""){
            this.props.history.push("/")
        }
        else{
            
        await axios("http://localhost:8082/getusers").then(res => 
            this.setState( {users: res.data })
        ); 
        let currentdata = this.state.users
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
        exactTweet.sort((a, b) => (a.sno < b.sno) ? 1 : -1)
        this.setState({ exactTweet })
        let datapic = this.state.users, mypic = ""
        for(let i = 0; i < datapic.length; i++){
            if(datapic[i].user === localStorage["user"]){
                mypic = datapic[i].profilepic
            }
        }
        this.setState({ mypic })
        let userssuggestions = []
        let users = this.state.exactTweet
        for(let i = 0; i < users.length; i++){
            userssuggestions.push(users[i].user)
        }
        
        this.setState({userssuggestions})
        }
    }
    handleProfileVisit = (e,name) => {
        e.persist();
        localStorage.setItem("profilename", name);
        this.props.history.push("/userprofile");
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
    handlelikes = (e, likes, mainid, id) => {
        this.setState({ flag: !this.state.flag})
        if(this.state.flag){
        likes = parseInt(likes) + 1}
        else if(!this.state.flag){
        likes = parseInt(likes) - 1}
        axios.patch('http://localhost:8082/updatelikes/' + mainid + "/" + id, {likes}).then(() => console.log("likes updated")).catch(error=> console.log(error))
        let arr = this.state.exactTweet
        for(let i = 0; i < arr.length; i++){
            if(arr[i].id === id){
                arr[i].likes = likes;
                break;
            }
        }
        this.setState({ exactTweet:arr });
    }
    handleCommentDelete = (tweetid, commentid) => {
        let comments = this.state.exactTweet
        for(let i = 0; i < comments.length; i++){
            if(comments[i].id === tweetid){
                let delcom = comments[i].comments
                let finalcom = []
                let count = 0
                for(let j = 0; j < delcom.length; j++){
                    if(delcom[j]._id !== commentid){
                        finalcom[count] = delcom[j]
                        count++
                    }
                }
                comments[i].comments = finalcom
            }
        }
        this.setState({ exactTweet:comments });
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
        const { text } = this.state;
        return (
             
            <bootstrap.Container>
            <bootstrap.Navbar style={{position: "fixed",top: "0",width:"60.6%",zIndex:"1", border: "2px solid white"}} bg="dark" variant="dark" >
                 <Link to="/myprofile"><bootstrap.Navbar.Brand title="Go to Your profile"><img alt="Twitter Logo" height="25" width="25" src={"TwitterLogo.png"} /> &nbsp; Welcome, <strong>{localStorage.getItem("name")}</strong>!</bootstrap.Navbar.Brand></Link>
                <bootstrap.Nav className="mr-auto">
                <bootstrap.Nav.Link onClick={this.handleShow3}>New Tweet</bootstrap.Nav.Link>
                <bootstrap.Nav.Link href="#" onClick={this.handleLogout}>Logout</bootstrap.Nav.Link>
                </bootstrap.Nav>
                <bootstrap.Form inline>
                <div id="notebooks">
                <bootstrap.Form.Control autoComplete="off"  id="query" value={text} onChange={this.onTextChange} placeholder="Search with username" />
                {this.renderSuggestions()}
                </div>&nbsp;
                <bootstrap.Button type="submit" variant="outline-info" onClick={this.handleUserSearch}>Search</bootstrap.Button>
                </bootstrap.Form>
                </bootstrap.Navbar>
                <bootstrap.Jumbotron fluid style={{backgroundColor:"#232733", marginTop: "50px", border: "2px solid white", padding:"22px"}}>
                    
                {this.state.users.length === 0 ? (
                  <center><bootstrap.Spinner animation="border" variant="primary" /></center>
                ) : (
                    <div style={{padding:"28px"}}>
                        <center><h3 style={{color:"white"}}>Tweets</h3></center>
                        <bootstrap.Row style={{display: "flex",justifyContent: "center"}}>                  
                        <center>
                    <bootstrap.Col >
                    <Modal  show={this.state.show3} onHide={this.handleClose3} size="lg" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
                                    <Modal.Header closeButton style={{backgroundColor:"#212020"}}>
                                    <Modal.Title style={{color:"white"}}>New Tweet</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{backgroundColor:"#232733"}}><NewTweet /></Modal.Body>
                                    <Modal.Footer style={{backgroundColor:"#212020"}}>
                                    <Link to="/tweets">
                                    <Button variant="secondary" onClick={this.handleClose3}>
                                        Close
                                    </Button>
                                    </Link>
                                    </Modal.Footer>
                        </Modal>
                    {this.state.exactTweet.map(tweet => (
                        <bootstrap.Row style={{border: "2px solid white", padding:"22px"}} key={tweet.sno} className="m-4 p-4 inline-flex border-2 border-black bg-gray-400" width="400">
                            <div className="col-sm-4">
                            <div className="cofounder-ceo-image">
                            
                             <Image
                             className="rounded-full"
                             style={{marginRight:"70px"}}
                             src={this.checkSrc(tweet.user,tweet.profilepic)}
                             alt={tweet.user}
                             width="100"
                             height="100"
                             roundedCircle
                             title="Visit their Profile"
                             onClick={e => this.handleProfileVisit(e, tweet.user)}
                             />
                             </div>
                             </div>
                             <div className="col-sm-8">
                             <bootstrap.Row><bootstrap.Col xs={14}><p title="Visit their Profile" onClick={e => this.handleProfileVisit(e, tweet.user)} style={{marginLeft: "-45px"}}><strong>{tweet.name}</strong> &nbsp;  @{tweet.user} &nbsp;·&nbsp;  {tweet.createdAt} </p></bootstrap.Col><bootstrap.Col>{tweet.user !== localStorage.getItem("user") ? "" :(
                                    <div>
                                    
                                    <bootstrap.Dropdown>
                                    <bootstrap.Dropdown.Toggle variant="secondary" size="sm" className="threedots" id="dropdown-basic">
                                    </bootstrap.Dropdown.Toggle>
                                    <bootstrap.Dropdown.Menu size="sm" title="">
                                    <bootstrap.Dropdown.Item variant="secondary" size="sm" className="float-center" onClick={e => this.handleShow(tweet.mainid, tweet.id, tweet.content, e)}>Edit Tweet</bootstrap.Dropdown.Item>
                                        <bootstrap.Dropdown.Item variant="secondary" size="sm" className="float-center" onClick={e => this.handleDelete(tweet.mainid, tweet.id, e)}>Delete Tweet</bootstrap.Dropdown.Item>
                                    </bootstrap.Dropdown.Menu>
                                    </bootstrap.Dropdown>
                                    
                                    <Modal  show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
                                    <Modal.Header closeButton style={{backgroundColor:"#212020"}}>
                                    <Modal.Title style={{color:"white"}}>Edit Tweet</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{backgroundColor:"#232733"}}><EditTweet mainid={this.state.modalmainid} id={this.state.modalid} currentcontent={this.state.currentcontent} onContentChange={this.setContentChange}/></Modal.Body>
                                    <Modal.Footer style={{backgroundColor:"#212020"}}>
                                    <Link to="/tweets">
                                    <Button variant="secondary" onClick={this.handleClose}>
                                        Close
                                    </Button>
                                    </Link>
                                    </Modal.Footer>
                                    </Modal>
                                    
                                    </div>
                                    )}</bootstrap.Col></bootstrap.Row>
                                    <h4>{tweet.content}</h4>
                                    <h5 title="like/dislike" onClick={e => this.handlelikes(e, tweet.likes, tweet.mainid, tweet.id)}>❤️ {tweet.likes} likes </h5>
                                    <h5 title="Add a comment" onClick={e => this.handleShow2(tweet.mainid, tweet.id, e)}>💭 {this.handleCommentLength(tweet.comments)} </h5>
                                    <Modal show={this.state.show2} onHide={this.handleClose2} size="lg" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
                                    <Modal.Header closeButton style={{backgroundColor:"#212020"}}>
                                    <Modal.Title style={{color:"white"}}>Comment</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{backgroundColor:"#232733"}}>
                                    <div>
                                    <Comments mainid={this.state.modalnewcommentmainid} id={this.state.modalnewcommentid} />
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer style={{backgroundColor:"#212020"}}>
                                    <Button variant="secondary" onClick={this.handleClose2}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                    </Modal>
                                    <h5 title="See Comments" onClick={e => this.handleShow1(tweet.comments, tweet.user, tweet.id)} >Show comments </h5>
                                    
                                    <Modal show={this.state.show1} onHide={this.handleClose1} size="lg" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
                                    <Modal.Header closeButton style={{backgroundColor:"#212020"}}>
                                    <Modal.Title style={{color:"white"}}>Comments</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{backgroundColor:"#232733"}}>
                                    <div>
                                    <CommentsShow comments={this.state.modalcomments} user={this.state.modalcommentsuser} tweetid={this.state.modaltweetsid} exactTweet={this.state.exactTweet} onDeleteComment={this.handleCommentDelete}/>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer style={{backgroundColor:"#212020"}}>
                                    <Link to="/tweets">
                                    <Button variant="secondary" onClick={this.handleClose1}>
                                        Close
                                    </Button>
                                    </Link>
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
                 </bootstrap.Jumbotron>
            </bootstrap.Container>
          
        );
    }
}

export default withRouter(Tweets);