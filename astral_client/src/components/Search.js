import React, {useState} from 'react'
import '../styles/Search.scss'

function Search({onClick, onKeyPress}) {

  const [search, updateSearch] = useState("");

  const onChange = (event) =>{ 
    if(!event.target.value){
      updateSearch("")
      onClick("")
    } else {
      updateSearch(event.target.value)
    }
  }

  return (
    <div className="search" onKeyPress={(event)=> onKeyPress(event,search)}>
        <input 
          autoFocus
          className="search-input" 
          value={search} 
          onChange={onChange}
        />
        <div className="search-icon" onClick={()=> onClick(search)}></div>
    </div>
    );
}

export default Search;



  

 





