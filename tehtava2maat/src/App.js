
import React from 'react'
import countryService from './services/countries'


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      countries: [],
      countriestoShow: [],
    }
  }

  componentWillMount() {
    countryService
    .getAll()
    .then(countries => {
      this.setState({ countries: countries, countriestoShow:countries })
    })
  }

  inputChanged = (event) => {
    console.log(event.target.value)
    const countriestoShow = this.state.countries.filter(country => country.name.toLowerCase().includes(event.target.value.toLowerCase()))
    this.setState({countriestoShow: countriestoShow})
  }

  countrySelected = (country) => {
    return () => {
      this.setState({countriestoShow: [country]})
    }
  }
  
  render() {
    return (
      <div>
        <h1>Muistiinpanot</h1>
        Find countries: <input onChange={this.inputChanged}></input>
        <ShowCountries
        countriestoShow = {this.state.countriestoShow}
        countrySelected = {this.countrySelected} />
      </div>
    )
    }
}

const ShowCountries = (props) => {
  if (props.countriestoShow.length === 0){
    return(
      <div>
        No countries found
      </div>
  )
    } else if (props.countriestoShow.length === 1){
      return(
        <div>
          <Country
          country = {props.countriestoShow[0]} />
        </div>
    ) 
      }else if (props.countriestoShow.length < 10){
        return(
          <div>
            Less than 10 countries found 
            {props.countriestoShow.map(c => <p key={c.name} onClick={props.countrySelected(c)}>{c.name}</p>)}
          </div>
      ) 
        }else {
        return(
          <div>
            Type countryname to find it
          </div>
      )
        }
}

const Country = (props) => {
  return(
    <div>
      <h1>{props.country.name}</h1>
      <p>Population: {props.country.population}</p>
      <img src={props.country.flag} alt="Flag" height="42"></img>
    </div>
  )
}

export default App