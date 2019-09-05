import React, { Component } from 'react';
import avatar1 from '../assets/avatar1.png';

class PostList extends Component {

  render(){
    return (
      <>
        <div className="post">
          <div className="post-header">
            <img src={avatar1} alt="Avatar 1"/>
            <div className="profile">
              <strong>Júlio Alcantara</strong>
              <span>04 Jul 2019</span>
            </div>
          </div>
          <div className="post-body">
            <p>Pessoal, alguém sabe se a Rocketseat está contratando?</p>
          </div>
        </div>        
      </>
    );
  }
}

export default PostList;