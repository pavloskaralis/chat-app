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
  const [form,setForm] = useState(null);
  const [error, setError] = useState(null);
  const [lobbySocket, setLobbySocket] = useState(null);
  const [rooms, updateRooms] = useState([]);

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
        console.log(roomsArray)

        updateRooms(roomsArray);
      }

      //when form errors
      if(data.error) {
        setError(data.error);
      }
      
      //when authorization is succesful 
      if(data.roomName && !data.request) {
        setForm(null)
        webSocket.close();
        history.push('/' + data.roomHash + '/' + data.roomName)
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
        //                 webSocket.send(JSON.stringify({
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
        //                 webSocket.send(JSON.stringify({
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

    webSocket.onclose = (e) => {
      console.error('lobby connection closed');
    };

    setLobbySocket(webSocket);
  }

  

  return (
    <div className="app">
      <div  className="app-overlay"></div>
      <Home setForm={setForm} toggleLobby={toggleLobby} setError={setError}/>
      <Switch>
        <Route path={'/:hash/:name'} render={()=> <Chat connectLobby={connectLobby} setError={setError}/>}/>
        <Route path={'/'} render={()=> lobby ? <Lobby rooms={rooms} setForm={setForm} toggleLobby={toggleLobby}/> : <></>}/>
      </Switch>
      {form && <Form form={form} setForm={setForm} lobbySocket={lobbySocket} error={error} setError={setError}/>}
      {/* no error component when form displays error */}
      {error && !form && <Error error={error} setError={setError}/>}
    </div>
  );
}

export default App;



  

 