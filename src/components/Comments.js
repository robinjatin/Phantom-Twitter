import React, { Component } from 'react';
import * as bootstrap from "react-bootstrap"
import {Button} from "react-bootstrap"
import axios from 'axios';

class Comments extends Component {
    state = {
        comments:{
        comment:"",
        commenter:"",
        commenterId:"",
        }
    }
    handleData = (e) => {
        const { comments } = this.state;
        comments[e.target.name] = e.target.value;
        this.setState({ comments });
    }
    handleAddComment = () => {
        const { comments } = this.state
        comments.commenter = localStorage["name"]
        comments.commenterId = localStorage["user"]
        this.setState({ comments })
        axios.patch('http://localhost:8082/newcomment/' + this.props.mainid + "/" + this.props.id , comments).then(() => console.log('successful!'))
    }
    render() {
        return (
            <bootstrap.Container>
                <bootstrap.Jumbotron style={{backgroundColor:"#232733"}}>
                    <center>
                <div className="m-4 p-4">
                    <h4 style={{color:"white"}}>Write your comment, <strong>{localStorage.getItem("name")}</strong></h4>
                     <textarea style={{backgroundColor:"lavender"}} placeholder="write your comment here" name="comment" rows="3" cols="50"  onChange={ this.handleData }/><br/><br/>
                    <Button onClick={ this.handleAddComment }>Add Comment</Button>
                </div>
                </center>
                </bootstrap.Jumbotron>
            </bootstrap.Container>
        );
    }
}

export default Comments;