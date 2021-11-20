import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import * as bootstrap from "react-bootstrap"
import {Button} from "react-bootstrap"

import axios from 'axios';

class NewTweet extends Component {
    constructor(props){
        super(props)
        this.state = {
            users:[],
            allsno: [],
            tweets:{
            content: '',
            sno: 0,
            likes: 0
            }
        }
    }
    async componentDidMount(){
        await axios("http://localhost:8082/getusers").then(res => 
            this.setState( {users: res.data })
        )
        let arr = this.state.users
        let allsno = []
        for(let i = 0; i < arr.length; i++){
            let arr2 = arr[i].tweets
            for(let j = 0; j < arr2.length; j++){
                if(arr2[j].sno)
                allsno.push(arr2[j].sno)
            }
        }
        this.setState({ allsno })
    }
    handleAddTweet = () => {
        const { tweets } = this.state
        const val = this.state.allsno
        if(val.length === 0){
            localStorage.setItem("sno", 0)
        }
        else{
            let exactsno = Math.max(...val)
            localStorage.setItem("sno", exactsno)
        }
        let current = localStorage["sno"]
        current =  parseInt(current) + 1
        localStorage.setItem("sno", current)
        tweets.sno = current
        this.setState({ tweets })
        axios.patch('http://localhost:8082/newtweet/' + localStorage['user'], tweets).then(() => this.props.history.push('/tweets'))
    }
    handleData = (e) => {
        const { tweets } = this.state;
        tweets[e.target.name] = e.target.value;
        this.setState({ tweets });
    }
    render() {
        return (
            <bootstrap.Container>
                <bootstrap.Jumbotron style={{backgroundColor:"#232733"}}>
                    <center>
                <div className="m-4 p-4">
                    <h4 style={{color:"white"}}>Write your tweet, <strong>{localStorage.getItem("name")}</strong></h4>
                     <textarea style={{backgroundColor:"lavender"}} placeholder="write here" name="content" rows="3" cols="50"  onChange={ this.handleData }/><br/><br/>
                    <Button onClick={ this.handleAddTweet }>Add Tweet</Button>
                </div>
                </center>
                </bootstrap.Jumbotron>
            </bootstrap.Container>
        );
    }
}

export default withRouter(NewTweet);