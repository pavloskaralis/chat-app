import React, { useEffect, useState } from 'react'
import { Route, Switch, matchPath } from 'react-router-dom'
import './App.scss'
import Home from './views/Home.js'
import Form from './views/Form.js'


function App() {

  const [lobby, toggleLobby] = useState(false);
  const [form,setForm] = useState(null);
  const [error, setError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(()=>{
    if (!matchPath(window.location.pathname, '/:hash/:name')) {
      connectLobby();
    }
  },[])

  const connectLobby = async () => {
    const lobbySocket = await new WebSocket('ws://localhost:8000/ws/astral/');
    lobbySocket.onmessage = function(e) {
        console.log('received')
    }
    setWebSocket(lobbySocket);
  }

  

  return (
    <div className="app">
      <div  className="app-overlay"></div>
      <Home setForm={setForm} toggleLobby={toggleLobby}/>
      <Switch>
        <Route path={'/:hash/:name'} render={()=><div>chat</div>}/>
        <Route path={'/'} render={()=> lobby ? <div>lobby</div> : <></>}/>
      </Switch>
      {form && <Form form={form} setForm={setForm} webSocket={webSocket} error={error}/>}
      {error && <div>error</div>}
    </div>
  );
}

export default App;



  

 