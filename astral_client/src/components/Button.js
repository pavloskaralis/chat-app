import React from 'react'
import '../styles/Button.scss'

function Button({text,className,onClick}) {
  return (
    <div className={className} onClick={onClick}>{text}</div>
  );
}

export default Button;



  

 


