import React from 'react'
import '../styles/Lobby.scss'

function Lobby({toggleForm, connectLobby}) {

  const toggles = [
    {type: "name", onClick: ()=>{}},
    {type: "users", onClick: ()=>{}},
    {type: "access", onClick: ()=>{}}
  ]
  return (
    <div className="lobby">
      <div className="exit-wrap">
        <div className="exit-button"></div>
      </div>
      
      <div className="search">
        <input className="search-left"/>
        <div className="search-right">
          <div className="search-icon"></div>
        </div>
      </div>

      {toggles.map((toggle,index)=> {
        return(
          <div className="lobby-toggle-wrap">
            <div className="lobby-toggle">
              <div className="toggle-button"></div>
              <div className="toggle-text"></div>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default Lobby;



  

 