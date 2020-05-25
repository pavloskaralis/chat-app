import React from 'react'
import '../styles/Form.scss'

function Form({form, webSocket, error}) {

  const type = {
    'start': {
      inputs: ['chat name', 'chat password', 'display name'],
      inputTypes: ['text','text','text'],
      descriptions: [
        'how users will identify your room in the lobby',
        'leave password blank to create a public chat',
        'how users will identify you in the chat room',
      ]
    },
    'join': {},
    'public': {},
    'private': {},
  }[form]

  return (
    <div className="form-container">
      <div className="form">

      </div>
    </div>
  );
}

export default Form;



  

 