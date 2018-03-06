import React from 'react'
import axios from 'axios';
import { Link } from 'react-router';
import Moment from 'moment';
import { browserHistory } from 'react-router';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state ={}
        axios.get('http://localhost:8080/confirm-login')
            .then((resp) => {
                if(!resp.data){
                    browserHistory.push('/');
                }
            })
    }

    componentWillMount() {
            axios.get('http://localhost:8080/posts')
            .then((resp) => {
                console.log(resp.data)
                this.setState({
                    posts: resp.data
                })
            })
    }

    showImageIfAvailable(imageAvailable){
        if(imageAvailable=='null'){
            return(
                <div></div>
            )
        }
        else{
        return (
                <a href="#" className="thumbnail">
                    <img alt="Image" src={imageAvailable} />
                </a>
              )
        }
    }

    createPostItems(){
        return this.state.posts.map((post) => {
            return(
                <div className="panel">
                    <div className="panel-heading">
                        <div className="text-center">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h3 className="pull-left">{post.title}</h3>
                                </div>
                                <div className="col-sm-3">
                                    <h4 className="pull-right">
                                        <small><em>{Moment(post.date).format('DD-MM-YYYY')}</em></small>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel-body">
                             {this.showImageIfAvailable(post.attachment)}
                        <div>
                             <div className="postBody ellipsis">
                              <span className="text-concat">
                                {post.body}
                              </span>
                            </div>
                        </div>
                    </div>

                    <div className="panel-footer">
                        <span className="label label-default">Posted By: {post.author} </span>
                        <div className="showPost"><input type="button" className="btn btn-primary" onClick={() => this.showPost(post.id)} value="Show post"/></div>
                    </div>
                </div>
            );
        })
    }
    showPost(post){
        browserHistory.push('/post/' + post);
    }

    logout(){
        axios.get('http://localhost:8080/signout')
            .then((resp) => {
                console.log("Logging out.")
                browserHistory.push('/');
            })
    }

    render() {
        const posts = this.state.posts;
        if (!this.state.posts) {
            return (
                <div>
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
                    <div className="cover">
                        <div className="coverImage"><img src="static/images/cover.jpg"/></div>
                        <div className="coverText">LIVE. LOVE. TRAVEL</div>
                    </div>
                </div>
            )
        }
        return (
        <div>
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
            <div className="cover">
                <div className="coverImage"><img src="static/images/cover.jpg"/></div>
                <div className="coverText">LIVE. LOVE. TRAVEL</div>
            </div>
            <div className="container">
                <div className="row allPosts">
                    <div className="col-md-10 col-md-offset-1">
                        <h2>&nbsp;&nbsp;Recent Stories</h2>
                        <div id="postlist">
                        {this.createPostItems()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Home;
