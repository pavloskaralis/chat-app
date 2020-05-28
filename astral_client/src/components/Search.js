import React, {useState} from 'react'
import '../styles/Search.scss'

function Search({onClick}) {

  const [search, updateSearch] = useState("");

  //allows enter key submit of search
  const onKeyPress = (event) => {
    if(event.key === 'Enter') {
      onClick(search);
    }
  }
  //if blank value, update lobby
  const onChange = (event) =>{ 
    if(!event.target.value){
      updateSearch(event.target.value);
      onClick(event.target.value);
    } else {
      updateSearch(event.target.value);
    }
  }

  return (
    <div className="search" onKeyPress={onKeyPress}>
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



  

 





