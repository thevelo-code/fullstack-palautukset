const DeleteButton = ({ id, name, handleDelete }) => {
  return (
    <button onClick={() => {
      if (window.confirm(`Delete ${name}?`)) {
        handleDelete(id, name);
      }
    }}>
      poista
    </button>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <DeleteButton id={person.id} name={person.name} handleDelete={handleDelete} />
    </li>
  )
}


const PersonList = ({ personsToShow, handleDelete }) => (
  <div>
    {personsToShow.map(person => (
      <Person key={person.name} person={person} handleDelete={handleDelete} />
    ))}
  </div>
)

export default PersonList