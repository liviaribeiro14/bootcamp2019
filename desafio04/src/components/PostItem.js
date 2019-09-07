import React from 'react';

function PostItem({post}) {
  return(
      <div className="post">
        <div className="header">
          <img src={require(`../assets/${post.avatar}.png`)} alt="Avatar"/>
          <div className="profile">
            <strong>{post.owner}</strong>
            <span>{post.date}</span>
          </div>
        </div>
        <div className="body">
          <p>{post.message}</p>
        </div>
        {post.replies.map(reply => (
          <PostReply key={reply.id} reply={reply}/>
        ))}
      </div> 
  );
}

function PostReply({reply}){
  return(
    <ul>
      <li>
        <img src={require(`../assets/${reply.avatar}.png`)} alt="Avatar 2"/>
        <div className="text">
          <strong>{reply.owner}</strong> {reply.message}
        </div>
      </li>
    </ul>
  );
}

export default PostItem;