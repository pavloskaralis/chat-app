import React, { useEffect, useState } from 'react'
import { matchPath } from 'react-router-dom'
import '../styles/Chat.scss'
import history from '../history.js'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'

function Chat({connectLobby,setError,setForm}) {
    
    const [chatSocket, setChatSocket] = useState(null);
    const [roomHistory, updateRoomHistory] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [displayNames, updateDisplayNames] = useState([]);
    const [roomName, setRoomNaame] = useState("");

    const connectChat = async () => {
        const splitUrl = window.location.pathname.split('/').filter(ele => ele.length > 0);
        const roomHash = splitUrl[0];
        const roomName = splitUrl[1];
        setRoomNaame(roomName);
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
            //connection erros
            if(data.error){
                //if invalid room, authentication, or full capacity
                if(!data.roomName) {
                    setError(data.error);
                    webSocket.close();
                } else {
                    //if room exists but is accessed via direct link
                    setForm({type: data.roomAccess, roomName: data.roomName})
                    webSocket.close(); 
                }
            }
            //on initial connection
            if(data.roomHistory) {
                updateRoomHistory(data.history);
                setDisplayName(data.displayName);
            }
            //when users arrive or exit
            if(data.displayNames) {
                updateDisplayNames(data.displayNames);
            }
            //when new message is added
            if(data.message) {
                const updatedHistory = roomHistory.map(message => message);
                updatedHistory.push(data);
                updateRoomHistory(updatedHistory);
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
        <div className="chat">
            <div className="title-container">
                <div className="title">{roomName}</div>
                <div className="chat-search-wrap">
                    <Search />
                </div>
                <div className="chat-exit-wrap">
                    <Exit />
                </div>
            </div>
            <div className="messages-container">

            </div>
            <textarea className="message-input" placeholder="Type a message..."/>
            <div className="users-container">
                <span className="online">{"Online:"}</span>
                {displayNames.map((name,index) => {
                    return (
                        <span className={name === displayName ? "user-display-name" : "display-name"}>
                            {index === displayNames.length - 1 ? " " + name : " " + name + ","}
                        </span>
                    )
                })}
            </div>
        </div>
    );
}

export default Chat;



  

 