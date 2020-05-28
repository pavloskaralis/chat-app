import React from 'react'
import '../styles/Home.scss'
import Button from '../components/Button.js';

function Home({setForm, toggleLobby, setError}) {
  
  return (
    <div className="home">
      <div className="title-wrap">
        <div className="title-top">welcome to</div>
        <div className="title-bottom">astral</div>
      </div>
      <div className="home-button-wrap">
        <Button 
          text="Start Chat" 
          className="start-button" 
          onClick={()=>{setForm({type: 'start', roomName: null}); 
          setError(null)}}
        />
        <Button 
          text="Join Chat" 
          className="join-button" 
          onClick={()=>{toggleLobby(true); 
          setError(null)}}
        />
      </div>
    </div>
  );
}

export default Home;



  

 