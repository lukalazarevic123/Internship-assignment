import React from "react";
import { Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function LeadingTable(props) {

    if(props.leaders.length !== 0){
      return(
        <Table bordered hover variant = "dark">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Cult</th>
                    <th>Votes</th>
                </tr>
            </thead>
            <tbody>
                {props.leaders.map(candidate => 
                    <tr key = {props.leaders.indexOf(candidate)}>
                        <td>{props.leaders.indexOf(candidate)+1}</td>
                        <td>{candidate.name}</td>
                        <td>{candidate.age}</td>
                        <td>{candidate.cult}</td>
                        <td>{candidate.votes}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        );  
    }else{
        return(
            <p>Press the button above</p>
        )
    }
    
}