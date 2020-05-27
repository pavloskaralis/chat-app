import React, { useState } from 'react'
import '../styles/Form.scss'
import Field from './Field.js'
import Button from './Button.js'

function Form({form, setForm, lobbySocket, error, setError, room, setRoom}) {

  const [matchError, setMatchError] = useState(null);

  const title = {
    'start': 'Start Chat',
    'private': room,
    'public': room
  }[form]

  const fields = {
    'start': {
      inputs: ['room name', 'password', 'display name'],
      inputTypes: ['text','text','text'],
      descriptions: [
        'How users will identify your room in the lobby.',
        'Leave password blank to create a public chat.',
        'How users will identify you in the chat room.',
      ]
    },
    'private': {
      inputs: ['display name', 'password'],
      inputTypes: ['text','password'],
      descriptions: [
        'How users will identify you in the chat room.',
        'This room is private and requires a password.'
      ]
    },
    'public': {
      inputs: ['display name'],
      inputTypes: ['text'],
      descriptions: ['How users will identify you in the chat room.']
    }
  }[form]

  const [roomName, updateRoomName] = useState('');
  const [roomPassword, updateRoomPassword] = useState('');
  const [displayName, updateDisplayName] = useState('');

  const value = {
    'room name': roomName,
    'password': roomPassword,
    'display name': displayName
  }

  const onChange = (event) => {
    return {
      'room name': ()=> updateRoomName(event.target.value),
      'password': ()=> updateRoomPassword(event.target.value),
      'display name': ()=> updateDisplayName(event.target.value)
    }[event.target.id]()
  }

  const submit = () => {
    setError(null);
    setMatchError(null);
    if (
      roomName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|[a-zA-Z\d]/) &&
      displayName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|[a-zA-Z\d]/) &&
      (!roomPassword || roomPassword.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|[a-zA-Z\d]/))
    ){
      lobbySocket.send(JSON.stringify({
          'roomName': roomName.replace(/\s/g,'_'),
          'roomPassword': roomPassword, 
          'displayName': displayName.replace(/\s/g,'_'), 
          'requestType': 'start'
      }));
    } else {
      if(!roomName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|[a-zA-Z\d]/)) {
        setMatchError('Room name must only contain letters, numbers, and enclosed spaces.')
      } else if (roomPassword && !roomPassword.match(/^[a-zA-Z\d]+$/)) {
        setMatchError('Password must only contain letters and numbers.')
      } else if (!displayName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|[a-zA-Z\d]/)) {
        setMatchError('Display name must only contain letters, numbers, and enclosed spaces.')
      }
    }
  }

  return (
    <div className="form-container">
      <div className="form">
        <div className="form-title">{title}</div>
        {fields.inputs.map((input, index)=> {
          return(
            <Field 
              key={"field" + index} 
              onChange={onChange} 
              field={fields} 
              index={index} 
              value={value[input]}
            />
          )
        })}
        {(error || matchError) && <div className="form-error">{"ERROR: " + (error ? error : matchError)}</div>}
        <div className="form-button-wrap">
          <Button text="Cancel" className="cancel-button" onClick={()=> {setForm(null); setRoom(null)}}/>
          <Button text="Submit" className="submit-button" onClick={submit}/>
        </div>
      </div>
    </div>
  );
}

export default Form;



  

 