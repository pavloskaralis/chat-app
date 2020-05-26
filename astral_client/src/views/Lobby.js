import React from 'react'
import '../styles/Lobby.scss'
import Exit from '../components/Exit.js'

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
        <div className="search">
          <input className="search-left"/>
          <div className="search-right">
            <div className="search-icon"></div>
          </div>
        </div>
      </div>
      

    <div className="toggle-wrap">
      {toggles.map((toggle,index)=> {
        return(
          <div className={toggle.className} onClick={toggle.onClick}>
            <div className="toggle-button"></div>
            <div className="toggle-text">{toggle.text}</div>
          </div>
        )
      })}
    </div>     

    <div className="room-container">
      {rooms.map((room) => {
        return(
          <div className="room">
            <div className="room-name"></div>
            <div className="room-capacity"></div>
            <div className="room-access"></div>
            <div className="connect-button"></div>
          </div>
        )
      })}
    </div> 
      
    </div>
  );
}

export default Lobby;



  

 