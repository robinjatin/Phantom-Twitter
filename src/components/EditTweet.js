import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import * as bootstrap from "react-bootstrap"
import {Button} from "react-bootstrap"
import axios from 'axios';

const EditTweet = (props) =>{
    const [content, setContent] = useState("")
    const mainid = props.mainid
    const id = props.id
    const currentcontent = props.currentcontent

    const handleData = (event) => {
        let val = event.target.value;
        setContent(val)
    }
    const handleEditTweet = () => {
        props.onContentChange(content)
        axios.patch('http://localhost:8082/updatetweet/' + mainid + "/" + id , {content}).then(() => console.log("successful!")).catch(error=> console.log(error))
    }
    return (
        <bootstrap.Container>
        <bootstrap.Jumbotron style={{backgroundColor:"#232733"}}>
            
        <div>
        <center>
            <h4 style={{color:"white"}}>Edit your tweet, <strong>{localStorage.getItem("name")}</strong></h4>
             <textarea style={{backgroundColor:"lavender"}} defaultValue={currentcontent}  name="content" rows="3" cols="50"  onChange={ handleData }/><br/><br/>
            <Button  onClick={ handleEditTweet }>Save Tweet</Button>
            </center>
        </div>
        
        </bootstrap.Jumbotron>
    </bootstrap.Container>
    )
}
export default withRouter(EditTweet);
