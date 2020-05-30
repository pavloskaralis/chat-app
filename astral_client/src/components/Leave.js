import React, {useState, useEffect} from 'react'
import '../styles/Leave.scss'
import Button from './Button.js'

function Leave({leave, setLeave}) {
    return (
        <div className="leave-container">
        <div className="leave">
            <div className="leave-title">
                Leave Chat?
            </div>
            <div className="leave-message">
                Note: empty rooms will be deleted. 
            </div>
            <div className="leave-button-wrap">
                <Button text="No" className="no-button" onClick={()=>setLeave(null)}/>
                <Button text="Yes" className="yes-button" onClick={leave.action}/>
            </div>
        </div>
        </div>
    );
}

export default Leave;



  

 