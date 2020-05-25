import React from 'react'
import '../styles/Form.scss'

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
            <div className="field-wrap">
              <div className="field-top">
                <div className="field-label">{input}</div>
                <input className="field-input" type={fields.inputTypes[index]} maxLength="16" />
              </div>
              <div className="field-bottom">
                {fields.descriptions[index]}
              </div>
            </div>
          )
        })}
        {error && <div className="form-error">{error}</div>}
        <div className="form-button-wrap">
          <div className="cancel-button" onClick={()=> setForm(null)}>cancel</div>
          <div className="submit-button">submit</div>
        </div>
      </div>
    </div>
  );
}

export default Form;



  

 