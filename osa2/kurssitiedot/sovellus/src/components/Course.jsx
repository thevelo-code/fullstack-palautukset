const Header = (props) => (
  <div>
    <h1>{props.name}</h1>
  </div>
)

const Part = (props) => (
  <p>
    {props.partname} {props.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map(part => (
      <Part key={part.id} partname={part.name} exercises={part.exercises} />
    ))}
  </div>
)

const Total = ({parts}) => {
  console.log(parts)
  const sum = parts.reduce((s, part) => s + part.exercises, 0)
  return (
    <p><b>Number of exercises {sum}</b></p>
  )
}



const Course = ({ course }) => (
    <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course