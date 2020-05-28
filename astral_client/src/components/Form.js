import React, { useState } from 'react'
import '../styles/Form.scss'
import Field from './Field.js'
import Button from './Button.js'

function Form({form, setForm, lobbySocket, error, setError}) {
  //monitors field input char errors
  const [matchError, setMatchError] = useState(null);
  //house values of each field 
  const [roomName, updateRoomName] = useState('');
  const [roomPassword, updateRoomPassword] = useState('');
  const [displayName, updateDisplayName] = useState('');

  //computed form title based on form type
  const title = {
    'start': 'Start Chat',
    'private': form.roomName ? form.roomName.replace(/_/g," ") : "",
    'public': form.roomName ? form.roomName.replace(/_/g," ") : ""
  }[form.type]


  //mapped as field components
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
  }[form.type]

  //designate state prop for each field value
  const value = {
    'room name': roomName,
    'password': roomPassword,
    'display name': displayName
  }

  //handle field inputs
  const onChange = (event) => {
    return {
      'room name': ()=> updateRoomName(event.target.value),
      'password': ()=> updateRoomPassword(event.target.value),
      'display name': ()=> updateDisplayName(event.target.value)
    }[event.target.id]()
  }

  //submit form on enter
  const onKeyPress = (event) => {
    if(event.key === 'Enter') {
      submit();
    }
  }

  //submit form; converts " " to "_" as required for django channels 
  const submit = () => {
    setError(null);
    setMatchError(null);
    //requestType equates to form type
    const requestType = form.type; 
    //if start form, room name has input field, otherwise it is stored in state
    const configuredRoomName = roomName ? roomName.replace(/\s/g,'_') : form.roomName
    if (
      ((requestType === 'start' && configuredRoomName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|^[a-zA-Z\d]$/))|| requestType !== "start") &&
      displayName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|^[a-zA-Z\d]$/) &&
      (!roomPassword || roomPassword.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|^[a-zA-Z\d]$/))
    ){
      lobbySocket.send(JSON.stringify({
          'roomName': configuredRoomName,
          'roomPassword': roomPassword, 
          'displayName': displayName.replace(/\s/g,'_'), 
          'requestType': requestType
      }));
    } else {
      if(requestType === 'start' && !configuredRoomName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|^[a-zA-Z\d]$/)) {
        setMatchError('Room name must only contain letters, numbers, and enclosed spaces.')
      } else if (roomPassword && !roomPassword.match(/^[a-zA-Z\d]+$/)) {
        setMatchError('Password must only contain letters and numbers.')
      } else if (!displayName.match(/^[a-zA-Z\d][a-zA-Z\d\s]{0,}[a-zA-Z\d]$|^[a-zA-Z\d]$/)) {
        setMatchError('Display name must only contain letters, numbers, and enclosed spaces.')
      }
    }
  }

  return (
    <div className="form-container" onKeyPress={onKeyPress}>
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
          <Button text="Cancel" className="cancel-button" onClick={()=> setForm({type: null, roomName: null})}/>
          <Button text="Submit" className="submit-button" onClick={submit}/>
        </div>
      </div>
    </div>
  );
}

export default Form;



  

 