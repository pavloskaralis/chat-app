import React from 'react'
import '../styles/Leave.scss'
import Button from './Button.js'

function Leave({leave, setLeave, remove}) {
    return (
        <div className="leave-container">
        <div className="leave">
            <div className="leave-title">
                Leave Chat?
            </div>
           {remove && <div className="leave-message">
                NOTE: empty rooms will be deleted. 
            </div>}
            <div className="leave-button-wrap">
                <Button text="No" className="no-button" onClick={()=>setLeave(null)}/>
                <Button text="Yes" className="yes-button" onClick={leave.action}/>
            </div>
        </div>
        </div>
    );
}

export default Leave;



  

 