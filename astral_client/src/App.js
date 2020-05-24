import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.scss'

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

  return (
    <div className="app">
      <div  className="app-overlay">
        <div>home</div>
        <Switch>
          <Route path={'/:hash/:name'} render={<div>chat</div>}/>
          <Route path={'/'} render={()=> lobby ? <div>lobby</div> : <></>}/>
        </Switch>
        {form && <div>form</div>}
        {error && <div>error</div>}
      </div>
    </div>
  );
}

export default App;



  

 