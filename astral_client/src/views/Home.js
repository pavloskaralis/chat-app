import React, {useState,useEffect} from 'react'
import '../styles/Home.scss'
import {matchPath} from 'react-router-dom'
import history from '../history.js'
import Button from '../components/Button.js';

function Home({setForm, toggleLobby, setError, setLeave}) {

  const [url, setUrl] = useState("/")

  //keeps track of url for prompting leave component before home buttonss
  useEffect(()=>{
    setUrl(window.location.pathname)
    console.log("CHANGED URL", window.location.pathname, url)
  },[window.location.pathname])

  //passed to leave component when start button clicked in chat room
  const start =  {
    action: () => {
      setForm({type: 'start', roomName: null}); 
      history.push('/');
      setLeave(null)
    }
  }
  //passed to leave component when leave button clicked in chat room
  const join = {
    action: () => {
      toggleLobby(true); 
      history.push('/');
      setLeave(null)
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
          onClick={!matchPath(url, '/:hash/:name') ?
            ()=> { 
              setForm({type: 'start', roomName: null}); 
              setError(null);
            } : () => setLeave(start)
          }
        />
        <Button 
          text="Join Chat" 
          className="join-button" 
          onClick={!matchPath(url, '/:hash/:name') ?
            ()=> { 
              toggleLobby(true); 
              setError(null);
            } : () => setLeave(join)
          }
        />
      </div>
    </div>
  );
}

export default Home;



  

 