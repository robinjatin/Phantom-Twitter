import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as bootstrap from "react-bootstrap"
import {Button} from "react-bootstrap"

import axios from 'axios';

class EditTweet extends Component {
    state = {
        content: '',
        mainid: localStorage["editmainid"],
        id: localStorage["editid"],
        currentcontent: "",
        tweets:[]
    }
    async componentDidMount() {
        if(localStorage.getItem("name") === ""){
            this.props.history.push("/")
        }
        else{
        await axios("http://localhost:8082/getusers").then(res => 
            this.setState( {tweets: res.data }));
        let alltweets = this.state.tweets;
        for(let i = 0;i < alltweets.length; i++){
            if(alltweets[i]._id === this.state.mainid){
                let current = alltweets[i].tweets
                for(let j = 0; j < current.length; j++){
                    if(current[j]._id === this.state.id){
                        this.setState({currentcontent:current[j].content})
                    }
                }
            }
        }
        }
    }
    handleEditTweet = () => {
        const content = this.state.content
        axios.patch('http://localhost:8082/updatetweet/' + this.state.mainid + "/" + this.state.id, {content}).then(() => this.props.history.push('/tweets')).catch(error=> console.log(error))
    }
    
    handleData = (event) => {
        let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]:val})
    }
    render() {
        return (
            <bootstrap.Container>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <bootstrap.Jumbotron style={{backgroundColor:"#232733"}}>
                    <center>
                <Link to="/tweets">
                
                </Link>
                <div className="m-4 p-4">
                    <h4 style={{color:"white"}}>Edit your tweet, <strong>{localStorage.getItem("name")}</strong></h4>
                     <textarea style={{backgroundColor:"lavender"}} defaultValue={this.state.currentcontent} name="content" rows="3" cols="50"  onChange={ this.handleData }/><br/><br/>
                    <Button  onClick={ this.handleEditTweet }>Save Tweet</Button>
                    &nbsp;
                    <Link to="/tweets">
                    <Button>
                    <span className="m-2">Cancel</span>
                    </Button>
                    </Link>
                </div>
                </center>
                </bootstrap.Jumbotron>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </bootstrap.Container>
        );
    }
}

export default withRouter(EditTweet);


{/* <bootstrap.Modal show={this.show} onHide={this.handleClose}>
<bootstrap.Modal.Header closeButton>
<bootstrap.Modal.Title>Modal heading</bootstrap.Modal.Title>
</bootstrap.Modal.Header>
<bootstrap.Modal.Body><EditTweet /></bootstrap.Modal.Body>
<bootstrap.Modal.Footer>
<bootstrap.Button variant="secondary" onClick={this.handleClose}>
    Close
</bootstrap.Button>
<bootstrap.Button variant="primary" onClick={this.handleClose}>
    Save Changes
</bootstrap.Button>
</bootstrap.Modal.Footer>
</bootstrap.Modal> */}


// onClick={e => this.handleEditTweet(tweet.mainid, e, tweet.id)}








