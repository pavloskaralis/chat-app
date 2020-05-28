import React, {useEffect, useState} from 'react'
import '../styles/Lobby.scss'
import Exit from '../components/Exit.js'
import Search from '../components/Search.js'
import Toggle from '../components/Toggle.js'
import Room from '../components/Room.js'

function Lobby({toggleLobby, rooms, lobbySocket}) {

  //monitors on scroll shadow
  const [shadow, toggleShadow] = useState(false);
  //monitors sort method
  const [sort, setSort] = useState('a-z');
  //stores search filter value; managed by search component to prevent auto render
  const [search, updateSearch] = useState("");
  //rooms with sort and filters applied
  const [configuredRooms, configureRooms] = useState(rooms)


  //search filter
  const filterRooms = (rooms) => {
    if(search){
      return rooms.filter(room => {
        return room.roomName.toLowerCase().includes(search.toLowerCase())
      })
    } else {
      return rooms
    }
  }
  
  //sort method; applied before filter method
  const sortRooms = () => {
    const roomsCopy = rooms.map(room => room);
    return {
      'a-z': ()=> roomsCopy.sort((a,b) => a.roomName > b.roomName ? 1 : -1),
      'z-a': ()=> roomsCopy.sort((a,b) => a.roomName > b.roomName ? -1 : 1),
      '1-8': ()=> roomsCopy.sort((a,b) => a.roomCapacity > b.roomCapacity ? 1 : -1),
      '8-1': ()=> roomsCopy.sort((a,b) => a.roomCapacity > b.roomCapacity ? -1 : 1),
      'pu-pr': ()=> roomsCopy.sort((a,b) => a.roomAccess > b.roomAccess ? -1 : 1),
      'pr-pu': ()=> roomsCopy.sort((a,b) => a.roomAccess > b.roomAccess ? 1 : -1),
    }[sort]()
  }

  //mapped as toggle components
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

  //configure rooms on update
  useEffect(() => { 
    const sortedRooms = sortRooms(); 
    const filteredRooms = filterRooms(sortedRooms);
    configureRooms(filteredRooms)
  },[rooms,sort,search])

  //add event listener on load
  useEffect(() => {
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



  return (
    <div className="lobby">
      <div className="lobby-exit-wrap">
        <Exit onClick={()=>toggleLobby(false)}/>
      </div>
      
      <div className="lobby-search-wrap">
        <Search onClick={(value)=>updateSearch(value)}/>
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
        {configuredRooms.map((room) => {
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



  

 