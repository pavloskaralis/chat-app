import React from 'react'
import '../styles/Toggle.scss'

function Toggle({toggle}) {
  return (
    <div className={toggle.className} onClick={toggle.onClick}>
        <div className="toggle-button">
        <div className="toggle-icon">
            <div className="triangle-top">&#9662;</div>
            <div className="triangle-bottom">&#9662;</div>
        </div>
        <div className="toggle-text">{toggle.text}</div>
        </div>
    </div>
    );
}

export default Toggle;



  

 


