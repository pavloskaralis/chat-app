import React, { useEffect, useState } from 'react'
import { Route, Switch, matchPath } from 'react-router-dom'
import './App.scss'
import Home from './views/Home.js'
import Form from './components/Form.js'
import Lobby from './views/Lobby.js'
import history from './history.js'

function App() {

  const [lobby, toggleLobby] = useState(false);
  const [form,setForm] = useState(null);
  const [error, setError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [rooms, updateRooms] = useState([]);

  useEffect(()=>{
    if (!matchPath(window.location.pathname, '/:hash/:name')) {
      connectLobby();
    }
  },[])

  const connectLobby = async () => {
    const lobbySocket = await new WebSocket('ws://localhost:8000/ws/astral/');
    lobbySocket.onmessage = function(e) {
    const data = JSON.parse(e.data); 
    
    //when socket returns room list, generate room nodes
    if(data.rooms) {
      updateRooms(data.rooms);
    }

    //when form errors
    if(data.error) {
      setError(data.error);
    }
    
    //when authorization is succesful 
    if(data.roomName && !data.request) {
      setForm(null)
      history.push('/' + data.roomHash + '/' + data.roomName + '/')
    }
     
      // when socket requests a password, show password input
      // if(data.request) { 
      //     if(data.request === 'private') {
      //         let text = document.createElement('div');
      //         let input = document.createElement('input');
      //         let br = document.createElement('br');
      //         let text2 = document.createElement('div');
      //         let input2 = document.createElement('input');
      //         let br2 = document.createElement('br');
      //         let submit = document.createElement('input');

      //         text.textContent = 'Enter Room Password'
      //         input.setAttribute('type','text')
      //         input.setAttribute('size','100')
      //         input.setAttribute('id','password-request-input')

      //         submit.setAttribute('type','button')
      //         submit.setAttribute('size','100');
      //         submit.setAttribute('id','private-request-submit')
      //         submit.setAttribute('value','enter')

      //         text2.textContent = 'Enter Display Name'
      //         input2.setAttribute('type','text')
      //         input2.setAttribute('size','100')
      //         input2.setAttribute('id','display-request-input')

      //         submit.onclick = () => {
      //             if(input.value.match(/[a-zA-Z\d_]+/)) {
      //                 lobbySocket.send(JSON.stringify({
      //                     'roomName': data.roomName,
      //                     'roomPassword': input.value,
      //                     'displayName': input2.value,
      //                     'requestType': 'private',
      //                 }));
      //             } else {
      //                 console.log({error: 'invalid characters'})
      //             }
      //         }

      //         document.body.append(text)
      //         document.body.append(input)
      //         document.body.append(br)
      //         document.body.append(text2)
      //         document.body.append(input2)
      //         document.body.append(br2)
      //         document.body.append(submit)
      //     } else if (data.request === 'public') {
      //         let text = document.createElement('div');
      //         let input = document.createElement('input');
      //         let br = document.createElement('br');
      //         let submit = document.createElement('input');

      //         text.textContent = 'Enter Display Name'
      //         input.setAttribute('type','text')
      //         input.setAttribute('size','100')
      //         input.setAttribute('id','display-request-input')

      //         submit.setAttribute('type','button')
      //         submit.setAttribute('size','100');
      //         submit.setAttribute('id','public-request-submit')
      //         submit.setAttribute('value','enter')

      //         submit.onclick = () => {
      //             if(input.value.match(/[a-zA-Z\d_]+/)) {
      //                 lobbySocket.send(JSON.stringify({
      //                     'roomName': data.roomName,
      //                     'displayName': input.value,
      //                     'requestType': 'public',
      //                 }));
      //             } else {
      //                 console.log({error: 'invalid characters'})
      //             }
      //         }


      //         document.body.append(text)
      //         document.body.append(input)
      //         document.body.append(br)
      //         document.body.append(submit)
      //     }
      // }
    }
    setWebSocket(lobbySocket);
  }

  

  return (
    <div className="app">
      <div  className="app-overlay"></div>
      <Home setForm={setForm} toggleLobby={toggleLobby}/>
      <Switch>
        <Route path={'/:hash/:name'} render={()=><div>chat</div>}/>
        <Route path={'/'} render={()=> lobby ? <Lobby rooms={rooms} setForm={setForm} toggleLobby={toggleLobby}/> : <></>}/>
      </Switch>
      {form && <Form form={form} setForm={setForm} webSocket={webSocket} error={error} setError={setError}/>}
      {error && <div>error</div>}
    </div>
  );
}

export default App;



  

 