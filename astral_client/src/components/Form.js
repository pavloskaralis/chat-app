import React from 'react'
import '../styles/Form.scss'
import Field from './Field.js'
import Button from './Button.js'

function Form({form, setForm, webSocket, error}) {

  const title = {
    'start': 'Start a Chat'
  }[form]

  const fields = {
    'start': {
      inputs: ['room name:', 'password:', 'display name:'],
      inputTypes: ['text','text','text'],
      descriptions: [
        'How users will identify your room in the lobby.',
        'Leave password blank to create a public chat.',
        'How users will identify you in the chat room.',
      ]
    },
    'join': {},
    'public': {},
    'private': {},
  }[form]

  return (
    <div className="form-container">
      <div className="form">
        <div className="form-title">{title}</div>
        {fields.inputs.map((input, index)=> {
          return(
            <Field key={"field" + index} field={fields} index={index}/>
          )
        })}
        {error && <div className="form-error">{error}</div>}
        <div className="form-button-wrap">
          <Button text="Cancel" className="cancel-button" onClick={()=> setForm(null)}/>
          <Button text="Submit" className="submit-button" onClick={()=>{}}/>
        </div>
      </div>
    </div>
  );
}

export default Form;



  

 