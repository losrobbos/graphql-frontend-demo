import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [continents, setContinents] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCode, setSelectedCode] = useState()

  // fetch continents from GraphQL 
  const fetchContinents = () => {

    let query = `
      {
        continents {
          code
          name
        }
      }`

    // HOW to send the query to the API? 
    // following the query JSON string we need to send in the end:
    // { "query": "{ \"continents\" { \"code\" \"name\" }  }" }

    // fetch the continents from GraphQL...
    fetch(`https://countries.trevorblades.com/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( { query } )
    })
    .then(res => res.json())
    .then(result => {
      console.log(result.data)
      setContinents(result.data.continents)
    })
    .catch(err => console.log("ERROR:", err))

    // AXIOS example call...
    // axios.post(`https://countries.trevorblades.com/graphql`, { query })
  }


  // fetch countries from GraphQL 
  const fetchCountries = () => {

    if(!selectedCode) return // no continent code selected? skip fetching countries 

    let query = `
      {
        continent(code:"${selectedCode}") {
          name
          code
          countries {
            code
            name
            capital
          }
        }
      }`

    // fetch the countries for this continent from GraphQL...
    fetch(`https://countries.trevorblades.com/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( { query } )
    })
    .then(res => res.json())
    .then(result => {
      console.log(result.data)
      setCountries(result.data.continent.countries)
    })
    .catch(err => console.log("ERROR:", err))
  }

  // if continent changed => load its f*** countries
  useEffect(() => {
    selectedCode && fetchCountries()
  }, [selectedCode])


  // RENDER OUR DOMMIE...

  return (
    <div className="App">
      <header className="App-header">

        {/* FETCH CONTINENTS ON CLICK */}
        <button onClick={ fetchContinents }>Fetch continents</button>

        {/* IF CONTINENTS LOADED => SHOW THEM IN DROPDOWN FOR GIVING F*** USER SOME CHOICE */}
        {
          continents.length ? 
          <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)} >
            {
              continents.map(continent => 
                <option key={continent.code} value={ continent.code } >{continent.name}</option>)
            }
          </select> : ''
        }

        {/* IF CONTINENT SELECTED => SHOW COUNTRIES OF F*** CONTINENT */}
        { selectedCode && 
          <div className="countries">
            {
              countries.map(country => 
                <div key={country.code} className="country">{country.name}</div>  
              )
            }
          </div>
        }

      </header>
      
      {/* LINK FOR TRAINING GRAQHQL QUERIES */}
      <footer>
        <a className="App-link"
            target="_blank" 
            href="https://lucasconstantino.github.io/graphiql-online"
            rel="noopener noreferrer"
          >
            Explore GraphQL
        </a>

      </footer>
    </div>
  );
}

export default App;
