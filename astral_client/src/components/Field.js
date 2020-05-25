import React from 'react'
import '../styles/Field.scss'

function Field({field, index}) {
  return (
    <div className="field-wrap">
        <div className="field-top">
            <div className="field-label">{field.inputs[index]}</div>
            <input className="field-input" type={field.inputTypes[index]} maxLength="16" />
        </div>
        <div className="field-bottom">
            {field.descriptions[index]}
        </div>
    </div>
  );
}

export default Field;



  

 


