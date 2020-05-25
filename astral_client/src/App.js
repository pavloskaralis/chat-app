import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.scss'
import Home from './views/Home.js'

function App() {

  const [lobby, toggleLobby] = useState(false);
  const [form,setForm] = useState(null);
  const [error, setError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  const connectLobby = async () => {
      const lobbySocket = await new WebSocket('ws://' + 'localhost:8000'+ '/ws/astral/');
      setWebSocket(lobbySocket);
      toggleLobby(!lobby);
  }

  const disconnectLobby = async () => {
    webSocket.close(); 
    toggleLobby(!lobby);
  }

  return (
    <div className="app">
      <div  className="app-overlay"></div>
      <Home setForm={setForm} connectLobby={connectLobby}/>
      <Switch>
        <Route path={'/:hash/:name'} render={()=><div>chat</div>}/>
        <Route path={'/'} render={()=> lobby ? <div>lobby</div> : <></>}/>
      </Switch>
      {form && <div>form</div>}
      {error && <div>error</div>}
    </div>
  );
}

export default App;



  

 