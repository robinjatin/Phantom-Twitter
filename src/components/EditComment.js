import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as bootstrap from "react-bootstrap"
import {Button} from "react-bootstrap"

import axios from 'axios';

class EditComment extends Component {
    state = {
        comment: '',
        user:this.props.user,
        tweetid: this.props.tweetid,
        commentid: this.props.commentid,
        currentcontent:this.props.comment
    }
    handleEditTweet = () => {
        const comment = this.state.comment
        axios.patch('http://localhost:8082/updatecomment/' + this.state.user + "/" + this.state.tweetid + "/" + this.state.commentid, {comment}).then(() => console.log("Successful!")).catch(error=> console.log(error))
    }
    
    handleData = (event) => {
        let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]:val})
    }
    render() {
        return (
            <bootstrap.Container>
                <bootstrap.Jumbotron style={{backgroundColor:"#232733"}}>
                    <center>
                <Link to="/tweets">
                
                </Link>
                <div className="m-4 p-4">
                    <h4 style={{color:"white"}}>Edit your comment, <strong>{localStorage.getItem("name")}</strong></h4>
                     <textarea style={{backgroundColor:"lavender"}} defaultValue={this.state.currentcontent} name="comment" rows="3" cols="50"  onChange={ this.handleData }/><br/><br/>
                    <Button  onClick={ this.handleEditTweet }>Save Comment</Button>
                   
                </div>
                </center>
                </bootstrap.Jumbotron>
            </bootstrap.Container>
        );
    }
}

export default withRouter(EditComment);