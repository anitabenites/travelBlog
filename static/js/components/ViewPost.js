import React, { PropTypes } from 'react'
import axios from 'axios'
import Moment from 'moment';
import { browserHistory } from 'react-router';
import Request from 'superagent';

class ViewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state ={};
        var url = "http://localhost:8080/confirm-login"
        Request.get(url).then((response)=>{
                if(!response.body){
                    browserHistory.push('/');
                }
                else{
                    this.setState({
                        user:response
                    })
                    this.loggedUser = response.body}
            })
    }
    componentWillMount() {
            console.log(this.state)
            axios.get('http://localhost:8080/postDetails/'+this.props.params.id)
            .then((response) => {
                axios.get('http://localhost:8080/comments/'+this.props.params.id)
                .then((resp) => {
                    var result = response.data[0];
                    result.comments = resp.data
                    this.setState({
                        currentPost: result
                    })
                    console.log(this.state)
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
    
    showCommentImageIfAvailable(imageAvailable){
        if(imageAvailable=='null'){
            return(
                <img src='/static/images/user.png' className="avatar" alt=""/>
            )
        }
        else{
        return (
                <img src={imageAvailable} className="avatar" alt=""/>
              )
        }
    }
    
    renderComments(){
        return this.state.currentPost.comments.map((comment) => {
            return(
                 <li className="clearfix">
                  {this.showCommentImageIfAvailable(comment.picture)}
                  <div className="post-comments">
                      <p className="meta">{Moment(comment.date).format('DD-MM-YYYY')}     {comment.name} says : </p>
                      <p>
                         {comment.body}
                      </p>
                  </div>
                </li>
            );
    })
    }
    
     logout(){
        axios.get('http://localhost:8080/signout')
            .then((resp) => {
                console.log("Logging out.")
                browserHistory.push('/');
            })
    }
    
    addComment(){
        this.comment = {
            post_id: this.state.currentPost.id,
            body: this.refs.userComment.value,
            author:this.loggedUser.username
        }
        if(!this.comment.body){
            console.log("comment not written!")
        }
        else{
            var url = "http://localhost:8080/comments"
            axios.post(url, this.comment).then((response)=>{
                console.log(response)
                if(response){
                    console.log("Comment has been added.")
                    browserHistory.push('/post/'+ this.state.currentPost.id);
                    window.location.reload()
                }
            })
        }
    }

    render() {
        if (!this.state.currentPost) {
            return (
                <div>
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
                <div className="container postContent">
                <div className="panel">
                    <div className="panel-heading">
                        <div className="text-center">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h3 className="pull-left">{this.state.currentPost.title}</h3>
                                </div>
                                <div className="col-sm-3">
                                    <h4 className="pull-right">
                                        <small><em>{Moment(this.state.currentPost.date).format('DD-MM-YYYY')}</em></small>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel-body">
                        {this.showImageIfAvailable(this.state.currentPost.attachment)}
                        <div>
                            {this.state.currentPost.body}
                        </div>
                    </div>
                    <div className="panel-footer">
                        <span className="label label-default">Posted By: {this.state.currentPost.author} </span>
                    </div>
                    <div className="bootstrap snippet">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="blog-comment">
                                    <h3 className="text-success">Comments</h3>
                                    <hr/>
                                        <ul className="comments">
                                            {this.renderComments()}
                                            <li className="clearfix">
                                                {this.showCommentImageIfAvailable(this.loggedUser.picture)}
                                              <div className="post-comments">
                                                  <p className="meta"><i>What do you have to say?</i></p>
                                                  <p>
                                                     <textarea ref="userComment"></textarea>
                                                  </p>
                                                    <input type="button" className="btn btn-primary" onClick={() => this.addComment()} value="Add Comment"/>
                                              </div>
                                            </li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


                </div>

        )
    }
}

export default ViewPost;