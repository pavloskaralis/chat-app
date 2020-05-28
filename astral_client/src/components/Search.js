import React from 'react'
import '../styles/Search.scss'

function Search({placeholder}) {
  return (
    <div className="search">
        <input className="search-input" placeholder={placeholder}/>
        <div className="search-icon"></div>
    </div>
    );
}

export default Search;



  

 





