import React, { PropTypes } from 'react'
import Request from 'superagent';
import axios from 'axios'
import { browserHistory } from 'react-router';

class CreatePost extends React.Component {
    constructor(props) {
        super(props);
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



    handleSubmit(){
        var reader  = new FileReader();
        var file = this.refs.attachment.files[0]
        if (file) {
            reader.readAsDataURL(file);
        }
        reader.addEventListener("load", function () {
            console.log(reader.result)
          }, false);
        setTimeout(function() {
            this.post = {
                title: this.refs.title.value,
                body: this.refs.body.value,
                author: this.loggedUser.username,
                attachment: reader.result
            }
            console.log(this.post)
            if(!this.post.title || !this.post.body){
                alert("Please enter all the details.")
            }
            if(!this.post.author){
                 browserHistory.push('/login');
            }
            if(this.post && this.post.title && this.post.body && this.post.author){
                console.log(this.post)
                var url = "http://localhost:8080/posts"
                Request.post(url, this.post).then((response)=>{
                    console.log(response)
                    this.setState({
                        user:response
                    })
                    console.log("Post added!")
                    browserHistory.push('/home');
                })
            }
        }.bind(this), 2000);
        var reader  = new FileReader();
        reader.readAsDataURL(this.refs.attachment.files[0]);
        console.log(reader.result)

    }

     logout(){
        axios.get('http://localhost:8080/signout')
            .then((resp) => {
                console.log("Logging out.")
                browserHistory.push('/');
            })
    }


    render() {
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
                <div className="container newPost">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <h2>What's on your mind today?</h2>
                          <form className="form-horizontal" >
                            <div className="form-group">
                              <label className="control-label col-sm-12">Title:</label>
                              <div className="col-sm-12">
                                <input type="text" className="form-control" id="title" ref="title" placeholder="Enter title" name="title"/>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12">Description:</label>
                              <div className="col-sm-12">
                                <textarea ref="body" rows="10" className="form-control" id="pwd" placeholder="Enter description" name="pwd"></textarea>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="control-label col-sm-12">Attachments:</label>
                              <div className="col-sm-12">
                                <input type="file" ref="attachment" accept="image/*" className="form-control" id="files" placeholder="Enter title" name="files"/>
                              </div>
                            </div>
                            <div class="form-group">
                              <div className="col-sm-offset-3 col-sm-6">
                                <input type="button" className="btn btn-default" onClick={() => this.handleSubmit()} value="Add Post"/>
                              </div>
                            </div>
                          </form>
                    </div>
                  </div>
                </div>
            </div>
        )
    }
}

export default CreatePost;
