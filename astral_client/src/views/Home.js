import React, {useState,useEffect} from 'react'
import '../styles/Home.scss'
import {matchPath} from 'react-router-dom'
import history from '../history.js'
import Button from '../components/Button.js';

function Home({setForm, toggleLobby, setError, setLeave}) {


  //passed to leave component when start button clicked in chat room
  const startAction =  {
    action: () => {
      setForm({type: 'start', roomName: null}); 
      history.push('/');
      setLeave(null)
    }
  }

  const start = () => {
      if(!matchPath(window.location.pathname, '/:hash/:name')){
        setForm({type: 'start', roomName: null}); 
        setError(null);
      } else {
        setLeave(startAction)
      }
  }
 
  //passed to leave component when leave button clicked in chat room
  const joinAction = {
    action: () => {
      toggleLobby(true); 
      history.push('/');
      setLeave(null)
    }
  }

  const join = () => {
    if(!matchPath(window.location.pathname, '/:hash/:name')){
      toggleLobby(true); 
      setError(null);
    } else {
      setLeave(joinAction)
    }
  }

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
          onClick={start}
        />
        <Button 
          text="Join Chat" 
          className="join-button" 
          onClick={join}
        />
      </div>
    </div>
  );
}

export default Home;



  

 