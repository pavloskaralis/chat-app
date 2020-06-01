import React, { useEffect, useState } from 'react'
import { matchPath } from 'react-router-dom'
import '../styles/Chat.scss'
import history from '../history.js'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'
import Message from '../components/Message.js'

function Chat({connectLobby,toggleLobby,setError,setForm,setLeave,toggleRemove}) {
    
    const [chatSocket, setChatSocket] = useState(null);
    const [roomHistory, updateRoomHistory] = useState([]);
    const [configuredRoomHistory, configureRoomHistory] = useState(roomHistory);
    const [search, updateSearch ] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [displayNames, updateDisplayNames] = useState([]);
    const [roomName, setRoomNaame] = useState("");
    const [messageValue, updateMessageValue] = useState("");
    const [newMessage, setNewMessage] = useState(null)
    const messageInput = React.createRef();
    const messageContainer = React.createRef();

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
            const data = JSON.parse(e.data); 
            console.log('data:',data)
            //connection erros
            if(data.error){
                //if invalid room, authentication, or full capacity
                if(!data.roomName) {
                    setError(data.error);
                    webSocket.close();
                //if room exists but is accessed via direct link
                } else {
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
                //needs to be passed out of socket for most updated history
                setNewMessage(data);
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
            event.preventDefault();
            updateMessageValue("");
        }
    }
  
    //tracks message input text
    const onChange = (e) => {
        updateMessageValue(e.target.value);
    }

    //function passed to leave component through exit button
    const exit = {
        action: ()=>{
            history.push('/');
            toggleLobby(true);
            setLeave(null);
        }
    }

    //add new message to history; can't be done within websocket
    useEffect(() => {
        if(newMessage){
            updateRoomHistory([...roomHistory,newMessage]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage])

    //apply search filter
    useEffect(() => { 
        const filterHistory = (history) => {
            if(search){
            return roomHistory.filter(history => {
                //matching message or display name
                return (
                    history.message.toLowerCase().includes(search.toLowerCase()) || 
                    history.displayName.replace(/_/g,' ').toLowerCase().includes(search.toLowerCase())
                )
            })
            } else {
                return history
            }
        }
        const filteredHistory = filterHistory(roomHistory);
        configureRoomHistory(filteredHistory)
    },[roomHistory,search])
    
    //auto scroll to bottom of message container
    useEffect( () => {
        if(!search){
            console.log("SCROLL HEIGHT")
            let scrollHeight = messageContainer.current.scrollHeight; 
            messageContainer.current.scrollTop = scrollHeight;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[configuredRoomHistory, displayName])

    //autosize message input
    useEffect( () => {
        let scrollHeight = messageInput.current.scrollHeight; 
        messageInput.current.style.height = scrollHeight + "px"
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[messageValue])

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
                    <Search onClick={(value)=>updateSearch(value)}/>
                </div>
                <div className="chat-exit-wrap">
                    <Exit onClick={()=>setLeave(exit)}/>
                </div>
            </div>

            <div className="messages-container" ref={messageContainer}>
                {configuredRoomHistory.map((history, index)=> {
                    return(
                        <Message 
                            key={"message" + index}
                            history={history}
                            isUser={history.displayName === displayName}
                            isSame={
                                index > 0 && 
                                history.displayName === configuredRoomHistory[index-1].displayName
                            }
                            isLast={
                                !configuredRoomHistory[index+1] ||
                                history.displayName !== configuredRoomHistory[index+1].displayName
                            }
                        />    
                    )
                })}
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



  

 