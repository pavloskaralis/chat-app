import React, {useState} from 'react'
import '../styles/Search.scss'

function Search({onClick}) {

  const [search, updateSearch] = useState("");

   //allows enter key submit of search
  const onKeyPress = (event,value) => {
    if(event.key === 'Enter') {
      onClick(value)
    }
  }
  //if blank value, update lobby
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



  

 





