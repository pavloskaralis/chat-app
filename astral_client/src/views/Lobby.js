import React, {useEffect, useState} from 'react'
import '../styles/Lobby.scss'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'
import Toggle from '../components/Toggle.js'
import Room from '../components/Room.js'

function Lobby({toggleForm, toggleLobby, rooms, lobbySocket}) {

  const [shadow, toggleShadow] = useState(false)
  const [sort, setSort] = useState('a-z')

  const toggles = [
    {
      text: "name", 
      className: "toggle-left", 
      onClick: ()=> sort === 'a-z' ? setSort('z-a') : setSort ('a-z')
    },
    {
      text: "users", 
      className: "toggle-middle", 
      onClick: ()=> sort === '1-8' ? setSort('8-1') : setSort ('1-8')
    },
    {
      text: "access", 
      className: "toggle-right", 
      onClick: ()=> sort === 'pu-pr' ? setSort('pr-pu') : setSort('pu-pr')
    }
  ]
 
  //add event listener on load
  useEffect(() => {
    console.log("readding event listener")
    const roomContainer = document.getElementById("room-container");
    const toggleContainer = document.getElementById("toggle-container");
    const scrollListener = () => {
      const shadowCheck = getComputedStyle(toggleContainer).boxShadow !== "none"
      if (roomContainer.scrollTop > 0 && !shadowCheck) {
        toggleShadow(true)
      } else if (roomContainer.scrollTop < 1 && shadowCheck ) {
        toggleShadow(false)
      }
    }
    roomContainer.addEventListener("scroll", scrollListener)
    return () => roomContainer.removeEventListener("scroll",scrollListener)
  },[])

  //computed property based on sort method
  const sortedRooms = {
   'a-z': ()=> rooms.sort((a,b) => a.roomName > b.roomName ? 1 : -1),
   'z-a': ()=> rooms.sort((a,b) => a.roomName > b.roomName ? -1 : 1),
   '1-8': ()=> rooms.sort((a,b) => a.roomCapacity > b.roomCapacity ? 1 : -1),
   '8-1': ()=> rooms.sort((a,b) => a.roomCapacity > b.roomCapacity ? -1 : 1),
   'pu-pr': ()=> rooms.sort((a,b) => a.roomAccess > b.roomAccess ? -1 : 1),
   'pr-pu': ()=> rooms.sort((a,b) => a.roomAccess > b.roomAccess ? 1 : -1),
  }[sort]()

  return (
    <div className="lobby">
      <div className="lobby-exit-wrap">
        <Exit onClick={()=>toggleLobby(false)}/>
      </div>
      
      <div className="lobby-search-wrap">
        <Search 
          placeholder="Separate names with a ','"
        />
      </div>

      <div className={shadow ? "toggle-container scroll-shadow" : "toggle-container"} id="toggle-container">
        <div className="inner-toggle-container"> 
          {toggles.map((toggle)=> {
            return(
              <Toggle key={toggle.text} toggle={toggle} />
            )   
          })}
        </div>
      </div>     

      <div className="room-container" id="room-container">
        {rooms.length === 0 && <div className="no-rooms">There are currently no rooms to join.</div>}
        {sortedRooms.map((room) => {
          return(
            <Room 
              key={room.roomName} 
              room={room} 
              onClick={() => {
                lobbySocket.send(JSON.stringify({
                  'roomName': room.roomName,
                  'requestType': 'join'
                }));
              }}
            />
          )
        })}
      </div>   
    </div>
  );
}

export default Lobby;



  

 