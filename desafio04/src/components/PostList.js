import React, { Component } from 'react';
import PostItem from './PostItem';

class PostList extends Component {
  state = {
    posts: [
      {
        id: 1,
        owner: "Júlio Alcantara",
        date: "04 Jul 2019",
        avatar: "avatar1",
        message: "Pessoal, alguém sabe se a Rocketseat está contratando?",
        replies: [
          {
            id: 11,
            owner:"Diego Fernandes",
            avatar: "avatar2",
            message: "A Rocketseat está sempre em busca de novos membros para o time, e geralmente ficamos de olho em quem se destaca no Bootcamp, inclusive 80% do nosso time de devs é composto por alunos do Bootcamp. Além disso, se você tem vontade de ensinar gravando vídeos e criando posts, pode me chamar no Discord! (Sério, me chamem mesmo, esse comentário é real)"
          }
        ]
      },
      {
        id: 2,
        owner: "Gabriel Lisboa",
        date: "04 Jul 2019",
        avatar: "avatar3",
        message: "Fala galera, beleza\?Estou fazendo o Bootcamp GoStack da Rocketseat e está sendo muito massa! Alguém mais aí fazendo, comenta na publicação para trocarmos uma ideia.",
        replies: [
          {
            id: 21,
            owner:"Clara Lisboa",
            avatar: "avatar4",
            message: "Também estou fazendo o Bootcamp e estou adorando! Estou no terceiro módulo sobre Node e já tenho minha API dos desafios contruída!"
          },
          {
            id: 22,
            owner:"Cézar Toledo",
            avatar: "avatar5",
            message: "Que maaaaassa! Estou pensando em me inscrever na próxima turma pra ver qual é desse Bootcamp GoStack, dizem que os devs saem de lá com super poderes!"
          }
        ]
      }
    ]
  };

  render(){
    return (      
      <>
        <div className="content">
          {this.state.posts.map(post => (
            <PostItem key={post.id} post={post}/>
          ))}
        </div>
      </>);
  }
}

export default PostList;