import React from 'react'
import '../styles/Home.scss'

function Home({setForm, connectLobby}) {

  return (
    <div className="home">
      <div className="title-wrap">
        <div className="title-top">welcome to</div>
        <div className="title-bottom">astral</div>
      </div>
      <div className="home-button-wrap">
        <span className="start-button" onClick={()=>setForm('start')}>Start a Chat</span>
        <span className="join-button">Join a Chat</span>
      </div>
    </div>
  );
}

export default Home;



  

 