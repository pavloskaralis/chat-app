

import React from 'react'
import '../styles/Message.scss'

function Message({history, isUser, isSame, isLast}) {

  return (
    isUser ? 
    <div className={isSame ? "user-wrap" : "user-wrap gap"}>
        <div className="user-message">{history.message}</div>
    </div> : 
    <div className={isSame ? "other-wrap" : "other-wrap gap"}>
        <div className="avatar-wrap">
            {isLast &&
                <div className="avatar"></div>
            }
        </div>
        <div className="data-container">
            {!isSame && <div className="other-display-name">
                {history.displayName.replace(/_/g,' ')}
            </div>}
            <div className="other-message">{history.message}</div>
        </div>
    </div>   
  );
}

export default Message;



  

 



