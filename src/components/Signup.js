import React,{Component} from "react"
import {InputGroup} from "react-bootstrap"
import * as bootstrap from "react-bootstrap"
import { withRouter, Link} from "react-router-dom";
import axios from 'axios';


class SignUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            tweets:[],
            formValues: {
                name:'',
                user:'',
                email:'',
                password:'',
                age:'',
                gender:'',
                social:'',
                bio:'No bio yet',
                location:'',
                profilepic: 'https://p.kindpng.com/picc/s/99-997900_headshot-silhouette-person-placeholder-hd-png-download.png'
              },
              formErrors: {
                name:'',
                user:'',
                email:'',
                password:'',
                age:'',
                gender:'',
                location:''
              },
              formValidity: {
                name: false,
                user: false,
                email: false,
                password: false,
                age:false,
                gender:false,
                location:false
              },
              isSubmitting: false
        }
    }
    async componentDidMount() {
        axios("http://localhost:8082/getusers").then(res => 
            this.setState( {tweets: res.data })
        ); 
    }
    handleChange = ({ target }) => {
        const { formValues } = this.state;
        formValues[target.name] = target.value;
        this.setState({ formValues });
        this.handleValidation(target);
      }; 
    handleValidation = target => {
        const { name, value } = target;
        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;
        const isName = name === "name";
        const isUser = name === "user";
        const isEmail = name === "email";
        const isPassword = name === "password";
        const isAge = name === "age";
        const isGender = name === "gender";
        const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        validity[name] = value.length > 0;
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `${name} is required and cannot be empty`;
        if (validity[name]) {
          if (isEmail) {
            let flag = false
              for(let i=0;i<this.state.tweets.length;i++){
                  if(value===this.state.tweets[i].email){
                      flag = true
                      break;
                  }
              }
            validity[name] = (emailTest.test(value) && flag === false);
            fieldValidationErrors[name] = validity[name]
              ? ""
              : `${name} should be a valid email address or it already exists`;
          }
          if (isPassword) {
            validity[name] = value.length >= 3;
            fieldValidationErrors[name] = validity[name]
              ? ""
              : `${name} should be 3 characters minimum`;
          }
          if (isName) {
            validity[name] = value.length >= 3 && value.length <=20;
            fieldValidationErrors[name] = validity[name]
              ? ""
              : `${name} should be 3 characters minimum and not exceed 20 characters`;
          }
          if (isUser) {
            let flag = false
              for(let i=0;i<this.state.tweets.length;i++){
                  if(value===this.state.tweets[i].user){
                      flag = true
                      break;
                  }
              }
            validity[name] = ((value.length >= 3 && value.length <=15) && flag === false);
            fieldValidationErrors[name] = validity[name]
              ? ""
              : `${name} should be 3 characters minimum and not exceed 15 characters or it is already taken`;

          }
          if (isAge) {
            validity[name] = value.length >= 1 && value.length <=3;
            fieldValidationErrors[name] = validity[name]
              ? ""
              : `${name} should be 2 characters minimum`;
          }
          if (isGender) {
            validity[name] = value !== "Choose Gender";
            fieldValidationErrors[name] = validity[name]
              ? ""
              : `${name} should not be empty`;
          }
         
        }
        this.setState({
          formErrors: fieldValidationErrors,
          formValidity: validity
        });
      };
    
      handleSubmit = event => {
        event.preventDefault();
        this.setState({ isSubmitting: true });
        const { formValues, formValidity } = this.state;
        if (Object.values(formValidity).every(Boolean)) {
          console.log(formValues)
          this.setState({ isSubmitting: false });
          axios.post('http://localhost:8082/newuser', formValues).then(() => this.props.onSubmission(), localStorage.setItem("dp", this.state.formValues.profilepic)).catch(error => {
            console.log(error.response)
        });
        } else {
          for (let key in formValues) {
            let target = {
              name: key,
              value: formValues[key]
            };
            this.handleValidation(target);
          }
          this.setState({ isSubmitting: false });
        }
      };
    render(){
        const mystyle = {
            color: "white",
            fontSize:"30px",
            padding: "30px",
            fontFamily: "Arial",
            textAlign: "center"
          };
          const { formValues, formErrors, isSubmitting } = this.state;
        return(
        <bootstrap.Container >
            <br/><br/>
            <bootstrap.Jumbotron style={{backgroundColor:"#232733"}}>

            <p style={mystyle}>Sign Up:</p>
                <bootstrap.Form  onSubmit={this.handleSubmit} >
                <bootstrap.Form.Control  name="name" type="text"  className={` ${
                  formErrors.name ? "is-invalid" : ""
                }`}
                placeholder="Enter Name"
                onChange={this.handleChange}
                value={formValues.name}
              />
              <div className="invalid-feedback">{formErrors.name}</div>
                <br/>
                <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text>@</InputGroup.Text>
          </InputGroup.Prepend>
                <bootstrap.Form.Control  name="user" type="text"  className={` ${
                  formErrors.user ? "is-invalid" : ""
                }`}
                placeholder="Enter Username"
                onChange={this.handleChange}
                value={formValues.user}
              />
              </InputGroup>
              <div className="invalid-feedback">{formErrors.user}</div>
                <br/>
                <bootstrap.Form.Control  name="email" type="email"  className={` ${
                  formErrors.email ? "is-invalid" : ""
                }`}
                placeholder="Enter Email"
                onChange={this.handleChange}
                value={formValues.email}
              />
              <div className="invalid-feedback">{formErrors.email}</div>
                <br/>
                <bootstrap.Form.Control   name="password" type="password"  className={` ${
                  formErrors.password ? "is-invalid" : ""
                }`}
                placeholder="Enter your Password"
                onChange={this.handleChange}
                value={formValues.password}
              />
              <div className="invalid-feedback">{formErrors.password}</div>
                <br/>
                <bootstrap.Form.Control  name="age" type="text" placeholder="Age" className={` ${
                  formErrors.age ? "is-invalid" : ""
                }`}
                onChange={this.handleChange}
                value={formValues.age}
              />
              <div className="invalid-feedback">{formErrors.age}</div>
              <br/>
                <bootstrap.Form.Control name="gender" as="select" placeholder="Gender" className={` ${
                  formErrors.gender ? "is-invalid" : ""
                }`}
                onChange={this.handleChange}
                value={formValues.gender}>
                    <option value="Choose Gender">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                 </bootstrap.Form.Control>
                 <div className="invalid-feedback">{formErrors.gender}</div>
                <br/>
                <bootstrap.Form.Control  name="social" type="text" placeholder="Add your social plug"
                onChange={this.handleChange}
                value={formValues.social}/>
              <br/>
              <bootstrap.Form.Control name="location" type="text"  className={` ${
                  formErrors.location ? "is-invalid" : ""
                }`}
                placeholder="Enter your Location"
                onChange={this.handleChange}
                value={formValues.location}
              />
              <div className="invalid-feedback">{formErrors.location}</div><br/>
              <bootstrap.Form.Control  onChange={this.handleChange} name="profilepic" type="text" placeholder="Upload the link of your profile pic" /><br/>
              <textarea className="form-control" name="bio" rows="3" cols="114"  onChange={ this.handleChange } placeholder={formValues.bio}/><br/>
                <bootstrap.Button type="submit" onClick={this.handleSubmit} disabled={isSubmitting}>Submit</bootstrap.Button>
                {/* {isSubmitting ? "Please wait..." : "Submit"} */}
                </bootstrap.Form>
                <br/>
                <p onClick={this.props.onSubmission} title="Click here to go back to login" style={{color:"white"}}>Already have an account?</p>
                
                </bootstrap.Jumbotron>
        </bootstrap.Container>
        )
    }
}

export default withRouter(SignUp)