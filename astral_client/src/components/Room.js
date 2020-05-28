import React from 'react'
import '../styles/Room.scss'

function Room({room, onClick}) {


  return (
    <div className="room-wrap">
      <div className="room">
          <div className="room-name">{room.roomName.replace(/_/g," ")}</div>
          <div className="room-capacity">{room.roomCapacity + " / 8"}</div>
          <div className="room-access">{room.roomAccess}</div>
          <div className="connect-wrap">
            <div className="connect-button"onClick={onClick}>connect</div>
          </div>
      </div>
    </div>
  );
}

export default Room;



  

 



