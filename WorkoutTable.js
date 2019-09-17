import React from 'react';
import {Table, Button} from 'reactstrap';

const WorkoutTable = (props) => {
  const deleteWorkout = (log) => {
    fetch(`http://localhost:3000/api/log/${log.id}`, {
        method: 'DELETE', 
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': props.token
        })
    })
    .then(() => props.fetchWorkouts())
  }

  
  const workoutMapper = () => {
    return props.log.map((log, index) => {
      return(
        <tr key={index}>
          <th scope="row">{log.id}</th>
          <td>{log.result}</td>
          <td>{log.description}</td>
          <td>{log.definition}</td>
          <td>
          <Button color="warning" onClick={() => {props.editUpdateWorkout(log); props.updateOn()}}>Update</Button>
            <Button color="danger" onClick={() => {deleteWorkout(log)}}>Delete</Button>
          </td>
        </tr>
      )
    })
  }

  return(
    <>
    <h3>Workout History</h3>
    <hr/>
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Result</th>
          <th>Description</th>
          <th>Definition</th>
        </tr>
      </thead>
      <tbody>
        {workoutMapper()}
      </tbody>
    </Table>
    </>
  )
}

export default WorkoutTable;
