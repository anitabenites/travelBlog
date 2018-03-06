import React, { PropTypes } from 'react'
import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state ={}
        axios.get('http://localhost:8080/confirm-login')
            .then((resp) => {
                if(!resp.data){
                    browserHistory.push('/home');
                }
            })
    }
    componentWillMount() {
            axios.get('http://localhost:8080/confirm-login')
            .then((resp) => {
                console.log(resp.data)
                this.setState({
                    user: resp.data
                })
            })
    }
    showImageIfAvailable(imageAvailable){
        if(imageAvailable=='null'){
            return(
                <img src='static/images/user.png' class="img-circle"/>
            )
        }
        else{
        return (    
                <img src={imageAvailable} class="img-circle"/>
              )
        }
    }
    
    logout(){
        axios.get('http://localhost:8080/signout')
            .then((resp) => {
                console.log("Logging out.")
                browserHistory.push('/');
            })
    }

    render() {
        if (!this.state.user) {
            return (
                <div>
                </div>
            )
        }
        return ( 
            <div className="profilePage"> 
                <nav className="navbar navbar-inverse">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <a className="navbar-brand" href="#">MyTravelBlog</a>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="/home">Home</a></li>
                        <li><a href="/profile">My Profile</a></li>
                        <li><a href="/createPost">Create New Post</a></li>
                        <li><input type="button" className="btn btn-default" onClick={() => this.logout()} value="Logout"/></li>
                    </ul>
                  </div>
                </nav>
                
                <div className="container">
                    <div className="row profileInner">
                            <div className="col-md-3" >
                                {this.showImageIfAvailable(this.state.user.picture)} 
                            </div>
                            <div className="col-md-9">
                                <div className="profileText">
                                    <h3>{this.state.user.name}</h3>
                                    <p>Username: {this.state.user.username}</p>
                                    <p>Email: {this.state.user.email}</p>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;