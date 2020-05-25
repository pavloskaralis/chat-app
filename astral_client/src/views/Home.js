import React from 'react'
import '../styles/Home.scss'
import Button from '../components/Button.js';

function Home({setForm, toggleLobby}) {
  
  return (
    <div className="home">
      <div className="title-wrap">
        <div className="title-top">welcome to</div>
        <div className="title-bottom">astral</div>
      </div>
      <div className="home-button-wrap">
        <Button text="Start a Chat" className="start-button" onClick={()=>setForm('start')}/>
        <Button text="Join a Chat" className="join-button" onClick={()=>toggleLobby(true)}/>
      </div>
    </div>
  );
}

export default Home;



  

 