import React from 'react'

const Search = ({termSearch,setTermSearch}) => {
  return (
    <div className='search'>
        <div>
            <img src="search.svg" alt="Search"/>
            <input
             type="text" 
             placeholder="Trouvez vos films parmis tant d'autres" 
             value={termSearch} 
             onChange={function(e){setTermSearch(e.target.value)}}
             />
        </div>
    </div>
  )
}

export default Search