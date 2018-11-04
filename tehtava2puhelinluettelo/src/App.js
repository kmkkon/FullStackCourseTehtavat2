import React from 'react';
import personService from './services/persons'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        persons: [
          ],
          personsToShow: [
          ],
      newName: '',
      newNumber: '',
      filter:'',
      successmessage: null
    }
    console.log('constructor')
  }

  componentDidMount() {
    personService
      .getAll()
      .then(response => {
        this.setState({ persons: response.data, personsToShow: response.data })
      })
  }

  addPerson = (event) => {
    console.log('Adding new person')
    event.preventDefault()
    if((this.state.persons.map(person => person.name)).indexOf(this.state.newName)>-1){
      console.log('Person exists')
      if (window.confirm("Haluatko vaihtaa käyttäjän " + this.state.newName + " numeron?")) { 
        console.log('Changing number for ' + this.state.newName)

        const person = this.state.persons.find(p => p.name === this.state.newName)
        const changedperson = { ...person, number: this.state.newNumber }
        console.log(changedperson)

        personService
        .update(person.id, changedperson)
        .then(response => {
          this.setState({
            persons: this.state.persons.map(p => p.id !== person.id ? p : changedperson),
            personsToShow: this.state.persons.map(p => p.id !== person.id ? p : changedperson),
            newName: '',
            newNumber: '',
            filter: '',
            successmessage: "Käyttäjän " + this.state.newName + " numero vaihdettu!"
          })
          setTimeout(() => {
            this.setState({successmessage: null})
          }, 5000)
          this.render()
        })
        .catch(error => {
          personService
          .getAll()
          .then(response2 => {
            this.setState({ persons: response2.data, personsToShow: response2.data })
          alert(`eipä löytyny nimmee ennää palvelimelt, yritäpäs uusiksi`)
          })
    
        })
      }
    } 
    else
    {
        const personObject = {
            name: this.state.newName,
            number: this.state.newNumber
        }
       
        personService
        .create(personObject)
        .then(response => {
            this.setState({
                persons: this.state.persons.concat(response.data),
                personsToShow: this.state.persons.concat(response.data),
                newName: '',
                newNumber: '',
                filter: '',
                successmessage: "Käyttäjä " + this.state.newName + " lisätty palvelimelle."
            })
        })
        setTimeout(() => {
          this.setState({successmessage: null})
        }, 5000)
    }
  }

  removePerson = (id) => {
    return() => {
      const personname = (this.state.persons.find(p => p.id ===id).name)
      if (window.confirm("Haluatko poistaa käyttäjän " + (this.state.persons.find(p => p.id ===id).name) + "?")) { 
        console.log('Removing person ' + id);
        personService
        .remove(id)
        .then(response => {
          personService
          .getAll()
          .then(response => {
            this.setState({ 
              persons: response.data, 
              personsToShow: response.data,
              successmessage: "Käyttäjä " + personname + " poistettu palvelimelta."
             })
            console.log("Loaded data after removal")
          })
      
        })
        setTimeout(() => {
          this.setState({successmessage: null})
        }, 5000)
          }

    
  }
}

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  handleFilterChange = (event) => {
    const personsToShow = this.state.persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    this.setState({filter: event.target.value, personsToShow})
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification message = {this.state.successmessage} />
        <Filtering state = {this.state} handleFilterChange={this.handleFilterChange} />
        <AddNewPerson state = {this.state} handleNameChange={this.handleNameChange} handleNumberChange={this.handleNumberChange} addPerson={this.addPerson}/>
        <Persons personsToShow={this.state.personsToShow} removePerson={this.removePerson}/>
      </div>
    )
  }
}

const Filtering = (props) => {
  return(
    <form >
    <div>
    <h2>Rajaa luetteloa</h2>
      Rajaus: 
      <input 
      value={props.state.filter}
      onChange={props.handleFilterChange} 
      />
    </div>
  </form>
)
}

const AddNewPerson = (props) => {
  return(
    <div>
      <h2>Lisää uusi</h2>
      <form onSubmit={props.addPerson}>
          <div>
            Nimi: 
            <input 
            value={props.state.newName}
            onChange={props.handleNameChange} 
            />
          </div>
          <div>
              Numero: 
            <input 
            value={props.state.newNumber}
            onChange={props.handleNumberChange} 
            />
          </div>
          <div>
            <button type="submit">Lisää</button>
          </div>
        </form>
    </div>
    
    )
}

const Persons = ({personsToShow, removePerson}) => {
    return(
        <div>
        <h2>Numerot</h2>
            {personsToShow.map(person => 
            <Person 
              key={person.id} 
              person={person} 
              removePerson={removePerson(person.id)}
              />)}
        </div>
    )
}

const Person = ({person, removePerson}) => {
  return(
    <p>{person.name} {person.number} <button onClick={removePerson}>Poista</button></p>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="successmessage">
      {message}
    </div>
  )
}

export default App