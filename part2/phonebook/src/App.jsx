import { useState , useEffect} from 'react'
import axios from 'axios'
import phonebookServices from './services/phonebookServices'
import './index.css'

const FilterNames = ({ nameSearch, persons, setPersons,setFeedBack}) => {
  const filteredArray = nameSearch.trim()
    ? persons.filter(person =>
        person.name.toLowerCase().includes(nameSearch.toLowerCase()))
    : persons
  console.log(persons)
  return (
    <ul>
      {filteredArray.map(person =>
        <li key={person.id}>{person.name} {person.number}
        <DeleteButton person={person} persons={persons} 
        setPersons={setPersons} setFeedBack={setFeedBack}/>
        </li>
      )}
    </ul>
  )
}

const DeleteButton = ({ person, setPersons, persons , setFeedBack}) => {
  const handleDelete = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookServices
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id));
        })
        .catch(error => {
          setFeedBack(`Information of ${person.name} has already been removed from server`)
        });
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={e => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const FilterBar = ({nameSearch, setNameSearch}) =>{
  return(
    <div>
        filter shown with: <input
          value={nameSearch}
          onChange={e => setNameSearch(e.target.value)}
        />
      </div>
  )
}

const RenderNumbers = (setPersons) => {
  useEffect(() => {
    console.log('effect')
    phonebookServices
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
}

const CheckIfRepeated = (newName, persons) => {
  return persons.find(person => person.name === newName)
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [feedback, setFeedBack] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    var newFeedback = "Person added succesfully."
    const newPerson = {
      name: newName,
      number: newNumber,
      id: String(Math.max(0, ...persons.map(p => Number(p.id))) + 1)
    }
    
    const existing = CheckIfRepeated(newName, persons)

    if (existing) {
      const updatedPerson = { ...existing, number: newNumber };
      phonebookServices
      .update(existing.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p =>
          p.id !== existing.id ? p : returnedPerson
        ));
        setFeedBack("Number updated succesfully.")
      })
      .catch(error => {
        alert(`Error updating ${newName}: ${error.message}`); 
      });
    } else {
      phonebookServices.create(newPerson)
      .then(created => {
        setPersons(persons.concat(created));
        setFeedBack("Addeded person succesfully.");
      })
      .catch(error => {
        alert(error.message);
      });
    }

    setNewName('')
    setNewNumber('')
    setTimeout(() => setFeedBack(""), 6000);
  }

  RenderNumbers(setPersons)
  
  return (
    <div>
      <h2>Phonebook</h2>
      <h1>{feedback}</h1>
      <FilterBar nameSearch={nameSearch} setNameSearch={setNameSearch}></FilterBar>
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <FilterNames nameSearch={nameSearch} persons={persons} 
      setPersons={setPersons} setFeedBack={setFeedBack}/>
    </div>
  )
}

export default App