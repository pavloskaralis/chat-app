import React, {useEffect, useState} from 'react'
import '../styles/Lobby.scss'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'
import Toggle from '../components/Toggle.js'
import Room from '../components/Room.js'

function Lobby({toggleForm, toggleLobby, rooms}) {

  const [shadow, toggleShadow] = useState(false)

  const toggles = [
    {text: "name", className: "toggle-left", onClick: ()=>{}},
    {text: "users", className: "toggle-right", onClick: ()=>{}},
    {text: "access", className: "toggle-right", onClick: ()=>{}}
  ]

  useEffect(() => {
    const roomContainer = document.getElementById("room-container");
    const toggleContainer = document.getElementById("toggle-container");
    roomContainer.addEventListener("scroll", () => {
      const shadowCheck = getComputedStyle(toggleContainer).boxShadow !== "none"
      if (roomContainer.scrollTop > 0 && !shadowCheck) {
        toggleShadow(true)
      } else if (roomContainer.scrollTop < 1 && shadowCheck ) {
        toggleShadow(false)
      }
    })
  },[])

  return (
    <div className="lobby">
      <div className="lobby-exit-wrap">
        <Exit onClick={()=>toggleLobby(false)}/>
      </div>
      
      <div className="lobby-search-wrap">
        <Search />
      </div>
      

      <div className={shadow ? "toggle-container scroll-shadow" : "toggle-container"} id="toggle-container">
        {toggles.map((toggle)=> {
          return(
            <Toggle key={toggle.text} toggle={toggle} />
          )
        })}
      </div>     

      <div className="room-container" id="room-container">
        {rooms.length === 0 && <div className="no-rooms">No rooms created.</div>}
        {rooms.map((room) => {
          return(
            <Room key={room.roomName }room={room}/>
          )
        })}
      </div>   
    </div>
  );
}

export default Lobby;



  

 