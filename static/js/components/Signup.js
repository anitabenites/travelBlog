import React, { PropTypes } from 'react'
import axios from 'axios';
import { browserHistory } from 'react-router';
import Request from 'superagent';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        axios.get('http://localhost:8080/confirm-login')
            .then((resp) => {
                if(resp.data){
                    browserHistory.push('/home');
                }
            })
    }
    handleSubmit(){
        var reader  = new FileReader();
        var file = this.refs.picture.files[0]
        if (file) {
            reader.readAsDataURL(file);
        }
        reader.addEventListener("load", function () {
            console.log(reader.result)
          }, false);
        setTimeout(function() { 
                 this.user = {
                    username: this.refs.username.value,
                    password: this.refs.password1.value,
                    name: this.refs.name.value,
                    email: this.refs.email.value,
                    about: 'null',
                    picture: reader.result,
                    blogTitle: 'null'
                }

                console.log(this.user)
                if(!this.user.username || !this.user.password || !this.user.name || !this.user.email){
                    console.log("Please enter all the fields.")
                }
                else{
                    console.log(this.user)
                    var url = "http://localhost:8080/signup"
                    Request.post(url, this.user).then((response)=>{
                        console.log(response)
                        this.setState({
                            user:response
                        })
                        this.loggedUser = JSON.parse(response.text)
                        console.log(this.loggedUser)
                        if(this.loggedUser.state=='success'){
                            browserHistory.push('/home');
                        }
                    })
                }
        }.bind(this), 2000);

       
    }
    render() {
        return ( 
            <div className="signup"> 
                 <nav className="navbar navbar-inverse">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <a className="navbar-brand" href="#">MyTravelBlog</a>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                      <li><a href="/login"><span class="glyphicon glyphicon-user"></span> Login</a></li>
                    </ul>
                  </div>
                </nav>
                <div className="row">
                    <div className="col-md-4 col-md-offset-4 signupBox">
                        <center><h3>Signup to MyTravelBlog</h3><br/></center>
                          <form className="form-horizontal" >
                            <div className="form-group">
                              <label className="control-label col-sm-12">Name:</label>
                              <div className="col-sm-12">
                                <input ref="name" type="text" className="form-control" id="name" placeholder="Enter name" name="email"/>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12">Email:</label>
                              <div className="col-sm-12">
                                <input ref="email" type="email" className="form-control" id="email" placeholder="Enter email" name="email"/>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12">Username</label>
                              <div className="col-sm-12">
                                <input ref="username" type="text" className="form-control" id="username" placeholder="Enter username" name="username"/>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12" >Password:</label>
                              <div className="col-sm-12">          
                                <input ref="password1" type="password" className="form-control" id="pwd1" placeholder="Enter password" name="pwd"/>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12" >Select an image:</label>
                              <div className="col-sm-12">          
                                <input type="file" className="form-control" id="picture" ref="picture" placeholder="Select an image" accept="image/*" name="picture"/>
                              </div>
                            </div>
                            <div className="form-group">        
                              <div className="col-sm-6 col-sm-offset-3">
                                <input type="button" className="btn btn-default" onClick={() => this.handleSubmit()} value="Sign up"/>
                              </div>
                            </div>
                          </form>    
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup;