import React from 'react';
import {Container, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Home.css';


export default function Home(props){
    return(
        <Container className = "align-self-center text-center">
            <div className = "welcome-box">
                <h1>Welcome</h1>
                <h2>to</h2>
                <h1>Wakanda's Elections</h1>
            </div>
            <Button as = {Link} to = '/register' className = "btn-dark ms-auto" size = "lg">Register</Button>
        </Container>
    )
}