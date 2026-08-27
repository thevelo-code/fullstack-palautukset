import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all}) => {
  console.log(good, neutral, bad, all)
  if (all === 0) {
    return (
      <div>
        ei yhtään palautetta annettu
      </div>
    )
  }
  const average = () => {
    if (all === 0) {
      return 0
    }
    return (good - bad) / all
  }

  const positivePercentage = () => {
    if (all === 0) {
      return 0
    }
    return (good / all) * 100 +" %"
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="hyvä" value={good} />
        <StatisticLine text="neutraali" value={neutral} />
        <StatisticLine text="huono" value={bad} />
        <StatisticLine text="yhteensä" value={all} />
        <StatisticLine text="keskiarvo" value={average()} />
        <StatisticLine text="positiivisia" value={positivePercentage()} />
      </tbody>
    </table>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    console.log("good")
    setGood(good + 1)
    setAll(all + 1)
  }

  const handleNeutral = () => {
    console.log("neutral")
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBad = () => {
    console.log("bad")
    setBad(bad + 1)
    setAll(all + 1)
  }


  return (
    <div>
      <h1>Anna palautetta</h1>
      <div>
        <Button handleClick={handleGood} text="hyvä" />
        <Button handleClick={handleNeutral} text="neutraali" />
        <Button handleClick={handleBad} text="huono" />
      </div>
      <h1>Statistiikka</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}


export default App