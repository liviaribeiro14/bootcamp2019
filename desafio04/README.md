# Desafio 04

## Timeline com posts e respostas

Primeiro exercício com o ReactJS com uma tela simulando uma timeline do Facebook.

A página é estática e só apresenta uma lista de posts. Em cada post pode ou não ter uma lista de replies.

## Desafios para mim

Principal desafio para mim foi montar o HTML. Estudei o Flexbox e montei a página conforme o modelo indicado na descrição do desafio.

Implementar o código do React foi mais simples. Montei um state simulando uma carga de dados com posts e replies. E injetei nos componentes que criei.

Tive dificuldades para renderizar as imagens que estavam na pasta Assets. Procurei como fazer isso e em vários lugares indicaram a usar a função require(""), mas encontrei a seguinte particularidade:

O módulo não era encontrado se eu utilizasse -

- post.avatar: **"../assets/avatar1.png"**
- **`` require(`${post.avatar}`) ``**

Para resolver o problema -

- post.avatar: **"avatar1"**
- **`` require(`../assets/${post.avatar}.png`) ``**
