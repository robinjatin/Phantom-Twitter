import * as bootstrap from "react-bootstrap"
import {Image, Modal, Button} from "react-bootstrap"
import { withRouter } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import EditComment from "./EditComment";

const CommentsShow = (props) =>{
    let [comments, editcomments] = useState(props.comments)
    let [vals, setVals] = useState({commentid:"", currentcomment:""})
    const user = props.user
    const tweetid = props.tweetid

    const [show, setShow] = useState(false);

  const handleClose = () => {
      setShow(false);
      window.location.reload(false)
  }
  const handleShow = (comment, tcommentid, e) =>{
        setVals({commentid: tcommentid, currentcomment: comment})
       setShow(true);
  }
    
    // const handleEditComment = (user, tweetid, commentid, e) => {
    //     localStorage.setItem("commentuser", user)
    //     localStorage.setItem("commenttweetid", tweetid)
    //     localStorage.setItem("commentid", commentid)
    //     this.props.history.push("/editcomment");
    // }
    const handleDeleteComment = (user, tweetid, commentid, e) => {
        if(window.confirm("Do you really want to delete it?"))
        {
        axios.patch("http://localhost:8082/deletecomment/" + user + "/" +tweetid + "/" + commentid).then(res =>
        console.log("Comment deleted")).catch((error) => {
            console.log("Could not delete the comment, error: ", error)
        });
        props.onDeleteComment(tweetid, commentid)
        const post = comments.filter(item => item._id !== commentid);
        editcomments(post)
    }
    }

    const commentPic = (username) =>{
        let tweets = props.exactTweet
        let pic = ""
        for(let i = 0; i < tweets.length; i++){
            if(tweets[i].user === username){
                pic = tweets[i].profilepic
            }
        }
        return pic
    }

    const checkSrc = (name, src) =>{
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
    const handleProfileVisit = (e,name) => {
        e.persist();
        localStorage.setItem("profilename", name);
        props.history.push("/userprofile");
    } 

    return(
        <div>
        {comments.length === 0 ? <p>No comments to show</p> : (
            <div>
                <br/>
        {comments.map(comment => (
        
        <div style={{border: "2px solid white", padding:"24px", maxWidth:"500px", marginLeft:"auto", marginRight:"auto"}} key={comment._id}>

            <bootstrap.Row>
                <bootstrap.Col xs={4}>
                    <Image
                className="rounded-full"
                style={{marginRight:"70px"}}
                src={checkSrc(comment.commenterId, commentPic(comment.commenterId))}
                alt={user}
                width="60"
                height="60"
                roundedCircle
                title="Visit their Profile"
                onClick={e => handleProfileVisit(e, comment.commenterId)}
                />
                </bootstrap.Col>
                <bootstrap.Col>
                    <bootstrap.Row>
                        <bootstrap.Col xs={14}>
            <h4>{comment.comment}</h4>
            <p><strong title="Visit their Profile" onClick={e => handleProfileVisit(e, comment.commenterId)} >{comment.commenter}</strong> &nbsp; @{comment.commenterId}</p>
            <p>{comment.commentedAt}</p>
            </bootstrap.Col>
            <bootstrap.Col>
            {comment.commenterId !== localStorage.getItem("user") ? "" :(
            <bootstrap.Dropdown>
            <bootstrap.Dropdown.Toggle variant="secondary" size="sm" className="threedots" id="dropdown-basic">
            </bootstrap.Dropdown.Toggle>
            <bootstrap.Dropdown.Menu size="sm" title="">
            <bootstrap.Dropdown.Item variant="secondary" size="sm" className="float-center" onClick={e => handleShow(comment.comment, comment._id, e)}>Edit Comment</bootstrap.Dropdown.Item>
            <bootstrap.Dropdown.Item variant="secondary" size="sm" className="float-center" onClick={e => handleDeleteComment(user, tweetid, comment._id, e)}>Delete Comment</bootstrap.Dropdown.Item>
            </bootstrap.Dropdown.Menu>
            </bootstrap.Dropdown>)}
            </bootstrap.Col>
            </bootstrap.Row>
            </bootstrap.Col>
            </bootstrap.Row>
            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
            <Modal.Header closeButton style={{backgroundColor:"#212020"}}>
          <Modal.Title style={{color:"white"}}>Edit Comment</Modal.Title>
            </Modal.Header>
         <Modal.Body style={{backgroundColor:"#212020"}}><EditComment user={user} tweetid={tweetid} commentid={vals.commentid} comment={vals.currentcomment}/></Modal.Body>
            <Modal.Footer style={{backgroundColor:"#212020"}}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
                </div>
                ))}
            </div>
            )}
            </div>
    )
    
}
export default withRouter(CommentsShow)