import React, { useEffect, useState } from 'react'
import { Route, Switch, matchPath } from 'react-router-dom'
import './App.scss'
import Home from './views/Home.js'
import Form from './components/Form.js'
import Lobby from './views/Lobby.js'
import Chat from './views/Chat.js'
import Error from './components/Error.js'

import history from './history.js'
function App() {

  const [lobby, toggleLobby] = useState(false);
  const [form,setForm] = useState({type: null, roomName: null});
  const [error, setError] = useState(null);
  const [lobbySocket, setLobbySocket] = useState(null);
  const [rooms, updateRooms] = useState([]);

  //connect to lobby websocket on load
  useEffect(()=>{
    if (!matchPath(window.location.pathname, '/:hash/:name')) {
      connectLobby();
    }
  },[])

  const connectLobby = async () => {
    const webSocket = await new WebSocket('ws://localhost:8000/ws/astral/');

    webSocket.onmessage = async (e) => {
      console.log('lobby connected')
      const data = JSON.parse(e.data); 
      //when socket returns room list, generate room nodes
      if(data.rooms) {
        //data.rooms is object so that it could be more easily updated on backend
        const roomKeys = Object.keys(data.rooms);
        const roomsArray = [];
        const populate = () => {
          for(let i = 0; i < roomKeys.length; i++){
            roomsArray.push(data.rooms[roomKeys[i]]);
          } 
        }
        await populate(); 

        updateRooms(roomsArray);
      }

      //when form errors
      if(data.error) {
        setError(data.error);
      }
      
      //when authorization is succesful 
      if(data.roomName && !data.request) {
        setForm({type: null, roomName: null})
        webSocket.close();
        history.push('/' + data.roomHash + '/' + data.roomName)
      }
      
      // when socket requests credentials
      if(data.request) { 
        setForm({type: data.request, roomName: data.roomName})
      }
    }

    webSocket.onclose = (e) => {
      console.error('lobby connection closed');
    };

    setLobbySocket(webSocket);
  }

  return (
    <div className="app">
      <div  className="app-overlay"></div>
      <Home 
        setForm={setForm}
        toggleLobby={toggleLobby} 
        setError={setError}
      />
      <Switch>
        <Route path={'/:hash/:name'} render={()=> <Chat 
            connectLobby={connectLobby} 
            setError={setError}
            setForm={setForm}
          />}
        />
        <Route path={'/'} render={()=> lobby ? <Lobby 
            rooms={rooms} 
            setForm={setForm} 
            toggleLobby={toggleLobby} 
            lobbySocket={lobbySocket}
          /> : <></>}
        />
      </Switch>
      {form.type && <Form 
        form={form} 
        setForm={setForm} 
        lobbySocket={lobbySocket} 
        error={error} setError={setError}
      />}
      {/* no error component when form displays error */}
      {error && !form.type && <Error
        error={error} 
        setError={setError}
      />}
    </div>
  );
}

export default App;



  

 