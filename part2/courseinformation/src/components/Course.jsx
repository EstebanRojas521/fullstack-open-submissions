const Course = ({ course }) => {
  var sum = course.parts.reduce((accumulator, part) =>
    accumulator + part.exercises,0
  )
  return (
    <>
      <h1>{course.name}</h1>
      {course.parts.map( part =>
       <li key={part.id}>{part.name} {part.exercises}</li> 
      )}
      <p>total of {sum} exercises</p>
    </>
  )
}

export default Course