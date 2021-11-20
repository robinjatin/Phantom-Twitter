import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as bootstrap from "react-bootstrap"

import axios from 'axios';

class EditDetails extends Component {
    state = {
        age: '',
        social: '',
        location:'',
        bio:'',
        profilepic:'',
        user: this.props.userid,
        tweet:[],
        currentage:"",
        currentlocation:"",
        currentbio:"",
        currentprofilepic:""
    }
    async componentDidMount() {
        if(localStorage.getItem("name") === ""){
            this.props.history.push("/")
        }
        else{
        await axios("http://localhost:8082/getuser/" + this.state.user).then(res => 
            this.setState( {tweet: res.data }));
        this.setState({ currentage:this.state.tweet[0].age, currentlocation:this.state.tweet[0].location, currentbio:this.state.tweet[0].bio, currentprofilepic:this.state.tweet[0].profilepic})
        }
    }

    handleSubmit = () => {
        let age = this.state.age
        let social = this.state.social
        let location = this.state.location
        let bio = this.state.bio
        let profilepic = this.state.profilepic
        let val = []
        if (this.state.age !== ""){
            val.push({age})
        }
        if (this.state.social !== ""){
            val.push({social})
        }
        if (this.state.location !== ""){
            val.push({location})
        }
        if (this.state.bio !== ""){
            val.push({bio})
        }
        if (this.state.profilepic !== ""){
            val.push({profilepic})
            localStorage.setItem("dp", profilepic)
        }
        axios.patch('http://localhost:8082/updatedetails/' + this.state.user, val[0]).then(() => this.props.handleSubmission()).catch(error=> console.log(error))
    }
    handleChange = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]:val})
      };
    render() {
        return (

                    <center>

                    <h2 style={{color:"white"}} className="m-2">Edit Details</h2>

                <div className="m-4 p-4">
                <br/>
                <bootstrap.Form.Control  onChange={this.handleChange} defaultValue={this.state.currentage} name="age" type="text" placeholder="Age" />
                <br/>
                <bootstrap.Form.Control  onChange={this.handleChange}  placeholder="Add Social Link" name="social" type="text" />
              <br/>
              <bootstrap.Form.Control  onChange={this.handleChange} name="location" type="text" defaultValue={this.state.currentlocation} placeholder="Location" /><br/>
              <bootstrap.Form.Control  onChange={this.handleChange} name="profilepic" type="text" placeholder={this.state.currentprofilepic}  /><br/>
              <textarea className="form-control" name="bio" rows="3" cols="114" placeholder={this.state.currentbio}  onChange={ this.handleChange }/><br/>
              <bootstrap.Button type="submit" onClick={this.handleSubmit}>Submit</bootstrap.Button>&nbsp;
              <bootstrap.Button onClick={this.props.handleSubmission} type="submit">Cancel</bootstrap.Button>
                
                </div>
                </center>

        );
    }
}

export default withRouter(EditDetails);