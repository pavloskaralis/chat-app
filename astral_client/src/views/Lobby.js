import React from 'react'
import '../styles/Lobby.scss'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'
import Toggle from '../components/Toggle.js'

function Lobby({toggleForm, toggleLobby, rooms}) {

  const toggles = [
    {text: "name", className: "toggle-left", onClick: ()=>{}},
    {text: "users", className: "toggle-right", onClick: ()=>{}},
    {text: "access", className: "toggle-right", onClick: ()=>{}}
  ]
  return (
    <div className="lobby">
      <div className="lobby-exit-wrap">
        <Exit onClick={()=>toggleLobby(false)}/>
      </div>
      
      <div className="lobby-search-wrap">
        <Search />
      </div>
      

    <div className="toggle-container">
      {toggles.map((toggle)=> {
        return(
          <Toggle key={toggle.text} toggle={toggle} />
        )
      })}
    </div>     

    <div className="room-container">
      {rooms.map((room) => {
        return(
          <div className="room">
            <div className="room-name">{room.roomName}</div>
            <div className="room-capacity">{room.roomCapacity + " / 8"}</div>
            <div className="room-access">{room.roomAccess}</div>
            <div className="connect-button">connect</div>
          </div>
        )
      })}
    </div> 
      
    </div>
  );
}

export default Lobby;



  

 