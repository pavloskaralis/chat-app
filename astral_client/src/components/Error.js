import React from 'react'
import '../styles/Error.scss'
import Button from './Button.js'

function Error({error, setError}) {

  return (
    <div className="error-container">
      <div className="error">
        <div className="error-title">Error:</div>
        <div className="error-message">{error}</div>
        <div className="error-button-wrap">
          <Button text="Close" className="close-button" onClick={()=> setError(null)}/>
        </div>
      </div>
    </div>
  );
}

export default Error;



  

 