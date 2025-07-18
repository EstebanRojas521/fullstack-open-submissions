import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
  <button onClick={onClick}>
    {text}
  </button>
  ) 
}

const StatisticLine  = ({ counter, text }) => {
  return (
    <div>
      {text}: {counter}
    </div>
  )
}

const Stats = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  } else {
    const total = good + neutral + bad
    const avg = (good + bad * -1) / total
    const positive = good / total * 100
    return (
      <div>
        <StatisticLine counter={good} text='good' />
        <StatisticLine counter={neutral} text='neutral' />
        <StatisticLine counter={bad} text='bad' />
        <StatisticLine counter={total} text='total' />
        <StatisticLine counter={avg} text ='average' />
        <StatisticLine counter={positive + '%'} text='positive' />
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App