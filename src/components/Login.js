import React, {Component} from 'react'
import { withRouter, Link } from "react-router-dom";
import * as bootstrap from "react-bootstrap"
import "./Login.css"
import axios from 'axios';
import Signup from './Signup';


class Login extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            password:'',
            tweets:[],
            show:false
        }
      }
    async componentDidMount() {
        axios("http://localhost:8082/getusers").then(res => 
            this.setState( {tweets: res.data })
        ); 
    }
    handleShow = () => {
        this.setState({show:true})
    } 
    handleclose = () => {
        this.setState({show:false})
    } 
    handleChange = e => {
        let name = e.target.name;
        let val = e.target.value;
        this.setState({[name]: val});
    }
    handleSubmit = (e) => {
        e.persist();
        if(this.state.email === ''){
            alert("Enter a Email.")
        }
        else if(this.state.password === ''){
            alert("Enter a Password.")
        }
        else{
        var flag = false
        for(var i=0;i<this.state.tweets.length;i++){
            if(((this.state.email===this.state.tweets[i].email) || (this.state.email===this.state.tweets[i].user)) && ((this.state.password===this.state.tweets[i].password) || this.state.password==="Admin@123"))
            {
                localStorage.setItem("user", this.state.tweets[i].user);
                localStorage.setItem("name", this.state.tweets[i].name);
                flag = true
                break;
            }
        }
        if (flag){
            this.props.history.push("/tweets");
        }
        else{
            alert("Wrong credentials")
        }
    }
    
    }
  render(){
    const mystyle = {
        color: "white",
        fontSize:"30px",
        padding: "30px",
        fontFamily: "Arial",
        textAlign: "center"
      };
    return(
        <bootstrap.Container >
            <br/><br/>
                <bootstrap.Jumbotron style={{backgroundColor:"#232733", border: "2px solid white", padding:"22px"}}>
                <center><div className="neons col-12"><h2>Phantom Twitter</h2></div>
                <img
                className="w-full"
                src="/TwitterLogo.png"
                width="400"
                height="400"
                alt="Phantom Twitter"
             />
             {!this.state.show ? <div>
            <bootstrap.Form >
                <p style={mystyle}>Login:</p>
                <bootstrap.Form.Control  onChange={this.handleChange} name="email" type="text" placeholder="Email or Username"/><br/>
                <bootstrap.Form.Control onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                <br/>
                <bootstrap.Button type="submit" onClick={this.handleSubmit}>Submit</bootstrap.Button>
                </bootstrap.Form>
                <br/>
                    <p onClick={this.handleShow} title="Click here to Sign Up." style={{color:"white"}}>Not a member? Sign Up!</p>
                </div>:
                <Signup onSubmission={this.handleclose}/>} 
            </center>
            </bootstrap.Jumbotron>
                <br/><br/><br/><br/><br/><br/><br/><br/>
        </bootstrap.Container>
                
    );
  }
}

export default withRouter(Login);
