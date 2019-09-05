import React, { Component } from "react";
import logo from '../assets/fb.png';
import profile from '../assets/profile.svg';

class Header extends Component{
  render() {
    return (
      <>
        <header id='main-header'>
          <img src={logo} alt='Facebook'/>
          <div className="profile">
            <a href=''>Meu perfil</a>
            <img src={profile} alt="Meu perfil"/>
          </div>
          
        </header>
      </>
    );
  }
}

export default Header;