import React from 'react';
import axios from 'axios';
import cookie from 'react-cookie';
import Request from 'superagent';
import { browserHistory } from 'react-router';


class Login extends React.Component {
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
        this.user = {
            username: this.refs.username.value,
            password: this.refs.password.value
        }
        if(!this.user.username || !this.user.password){
            console.log("Please enter username and password correctly.")
        }
        else{
            var url = "http://localhost:8080/login"
            Request.post(url, this.user).then((response)=>{
                this.setState({
                    user:response
                })
                this.loggedUser = JSON.parse(response.text)
                if(this.loggedUser.state=='success'){
                    browserHistory.push('/home');
                }
            })
        }
    }

    render() {
        return ( 
            <div className="login">
                <nav className="navbar navbar-inverse">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <a className="navbar-brand" href="#">MyTravelBlog</a>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                      <li><a href="/signup" ><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
                    </ul>
                  </div>
                </nav>
                <div className="row">
                    <div className="col-md-4 col-md-offset-4 loginBox">
                        <center><h3>Login to MyTravelBlog</h3><br/></center>
                          <form className="form-horizontal">
                            <div className="form-group">
                              <label className="control-label col-sm-12">Username:</label>
                              <div className="col-sm-12">
                                <input type="text" ref="username" className="form-control" id="username" placeholder="Enter username" name="email" required/>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12" >Password:</label>
                              <div className="col-sm-12">          
                                <input type="password" ref="password" className="form-control" id="pwd" placeholder="Enter password" name="pwd" required/>
                              </div>
                            </div>
                            <div className="form-group">        
                              <div className="col-sm-6 col-sm-offset-3">
                                <input type="button" className="btn btn-default" onClick={() => this.handleSubmit()} value="Submit"/>
                              </div>
                            </div>
                          </form>    
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;