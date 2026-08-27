import { useState } from 'react'

const RandomAnecdote = ({anecdotes, selected, votes}) => {
  return (
    <div>
      <h1>Satunnainen anekdootti</h1>
      <p>{anecdotes[selected]}</p>
      <p>{votes[selected]} ääntä</p>
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const MostVoted = ({anecdotes, votes}) => {
  const maxVotes = Math.max(...votes)
  const indexOfMaxVotes = votes.indexOf(maxVotes)
  console.log("eniten ääniä", maxVotes, "indeksi", indexOfMaxVotes)

  if (maxVotes === 0) {
    return (
      <div>
        <h2>Eniten ääniä</h2>
        ei yhtään ääntä annettu
      </div>
    )
  }

  return (
    <div>
      <h2>Eniten ääniä</h2>
      <p>{anecdotes[indexOfMaxVotes]}</p>
      <p>{maxVotes} ääntä</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  console.log("valittu anekdootti", selected)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  console.log("äänet", votes)

  const randomIndex = () => {
    return Math.floor(Math.random() * anecdotes.length)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <div>
        <RandomAnecdote anecdotes={anecdotes} selected={selected} votes={votes} />
      </div>
      <Button handleClick={() => setSelected(randomIndex())} text="Seuraava" />
      <Button handleClick={handleVote} text="Äänestä" />
      <div>
        <MostVoted anecdotes={anecdotes} votes={votes} />
      </div>
    </div>
  )
}

export default App