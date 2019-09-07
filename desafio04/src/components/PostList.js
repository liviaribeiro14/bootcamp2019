import React, { Component } from 'react';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';

class PostList extends Component {

  render(){
    return (
      <>
        <div className="content">
          <div className="post">
            <div className="header">
              <img src={avatar1} alt="Avatar 1"/>
              <div className="profile">
                <strong>Júlio Alcantara</strong>
                <span>04 Jul 2019</span>
              </div>
            </div>
            <div className="body">
              <p>Pessoal, alguém sabe se a Rocketseat está contratando?</p>
            </div>
            <ul>
              <li>
                <img src={avatar2} alt="Avatar 2"/>
                <div className="text"><strong>Diego Fernandes</strong> A Rocketseat está sempre em 
                  busca de novos membros para o time, e geralmente ficamos de olho 
                  em quem se destaca no Bootcamp, inclusive 80% do nosso time de 
                  devs é composto por alunos do Bootcamp. Além disso, se você tem 
                  vontade de ensinar gravando vídeos e criando posts, pode me 
                  chamar no Discord! (Sério, me chamem mesmo, esse comentário 
                  é real)
                </div>
              </li>
            </ul>
          </div> 
        </div>      
      </>
    );
  }
}

export default PostList;