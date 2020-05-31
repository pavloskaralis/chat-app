import React, { useEffect, useState } from 'react'
import { matchPath } from 'react-router-dom'
import '../styles/Chat.scss'
import history from '../history.js'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'

function Chat({connectLobby,toggleLobby,setError,setForm,setLeave,toggleRemove}) {
    
    const [chatSocket, setChatSocket] = useState(null);
    const [roomHistory, updateRoomHistory] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [displayNames, updateDisplayNames] = useState([]);
    const [roomName, setRoomNaame] = useState("");
    const [messageValue, updateMessageValue] = useState("");
    const messageInput = React.createRef();

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
                    console.log("ERROR ONE")
                    setError(data.error);
                    webSocket.close();
                } else {
                    console.log("ERROR TWO")
                    //if room exists but is accessed via direct link
                    setForm({type: data.roomAccess, roomName: data.roomName})
                    webSocket.close(); 
                }
            }
            //on initial connection
            if(data.roomHistory) {
                updateRoomHistory(data.roomHistory);
                setDisplayName(data.displayName);
            }
            //when users arrive or exit
            if(data.displayNames) {
                data.displayNames.length > 1 ? toggleRemove(false) : toggleRemove(false);
                updateDisplayNames(data.displayNames.sort());
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

    //enable enter key submit
    const onKeyPress = (event) => {
        if(event.key === 'Enter') {
            if (event.shiftKey) return;
            chatSocket.send(JSON.stringify({
                'message': messageValue
            })); 
            updateMessageValue("");
        }
    }
  
    //tracks message input text
    const onChange = (e) => {
        updateMessageValue(e.target.value);
    }

    // const inputKeyDown = (e)

    //function passed to leave component through exit button
    const exit = {
        action: ()=>{
            history.push('/');
            toggleLobby(true);
            setLeave(null);
        }
    }

    //autosize message input
    useEffect( () => {
        let scrollHeight = messageInput.current.scrollHeight; 
        messageInput.current.style.height = scrollHeight + "px"
    },[messageInput, messageValue])

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
                <div className="chat-title">{roomName}</div>
                <div className="chat-search-wrap">
                    <Search />
                </div>
                <div className="chat-exit-wrap">
                    <Exit onClick={()=>setLeave(exit)}/>
                </div>
            </div>

            <div className="messages-container">
                {roomHistory.length === 0 && <div className="no-messages">There are currently no messages.</div>}
            </div>

            <textarea 
                onChange={onChange}
                onKeyPress={onKeyPress}
                value={messageValue} 
                ref={messageInput} 
                className="message-input" 
                placeholder="Type a message..."
            />
            
            <div id="users-container" className="users-container">
                <span className="online">Online:</span>
                {displayNames.map((name,index) => {
                    return (
                        <span key={"displayName" + index} className={name === displayName ? "user-display-name" : "display-name"}>
                            {index === displayNames.length - 1 ? 
                                '\u00A0' + name.replace(/_/g,' ') : 
                                '\u00A0' + name.replace(/_/g,' ') + ","
                            }
                        </span>
                    )
                })}
            </div>
        </div>
    );
}

export default Chat;



  

 