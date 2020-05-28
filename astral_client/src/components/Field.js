import React from 'react'
import '../styles/Field.scss'

function Field({field, value, index, onChange}) {
  return (
    <div className="field-wrap">
        <div className="field-top">
            <div className="field-label">{field.inputs[index] + ":"}</div>
            <input 
              autoFocus={index === 0 ? true : false}
              id={field.inputs[index]}
              className="field-input" 
              type={field.inputTypes[index]} 
              maxLength="12" 
              value={value}
              onChange={onChange}
            />
        </div>
        <div className="field-bottom">
            {field.descriptions[index]}
        </div>
    </div>
  );
}

export default Field;



  

 


