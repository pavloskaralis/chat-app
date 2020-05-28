import React, { useEffect, useState } from 'react'
import { matchPath } from 'react-router-dom'
import '../styles/Chat.scss'
import history from '../history.js'

function Chat({connectLobby,setError,setForm, setRoom}) {
    
    const [chatSocket, setChatSocket] = useState(null);

    const connectChat = async () => {
        const splitUrl = window.location.pathname.split('/').filter(ele => ele.length > 0);
        const roomHash = splitUrl[0];
        const roomName = splitUrl[1];
        const webSocket = await new WebSocket( 
            'ws://localhost:8000/ws/astral/'
            + roomHash
            + '/'
            + roomName
            + '/'
        );

        webSocket.onmessage = (e) => {
            console.log('chat connected')
            const data = JSON.parse(e.data); 
            console.log('data:',data)
            if(data.error){
                //if invalid room, authentication, or full capacity
                if(!data.roomName) {
                    setError(data.error);
                    webSocket.close();
                } else {
                    //if room exists but is accessed via direct link
                    if(data.roomAccess === 'private') {
                        setForm('private')
                        setRoom(data.roomName)
                    } else if (data.roomAccess === 'public') {
                        setForm('public')
                        setRoom(data.roomName)
                    }
                    webSocket.close(); 
                }
            }
        }

        webSocket.onclose = async (e) => {
            console.error('chat connection closed');
            history.push('/')
            connectLobby(); 
        };

        setChatSocket(webSocket);
    }
  
    //connect to web socket on load
    useEffect( () => {
        if (matchPath(window.location.pathname, '/:hash/:name')) {
            connectChat();
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  
    //disconnect from chat socket on dismount 
    useEffect( () => { 
        return ()=> {if(chatSocket) chatSocket.close()};
    },[chatSocket])
    
    return (
        <div className="chat">chat</div>
    );
}

export default Chat;



  

 