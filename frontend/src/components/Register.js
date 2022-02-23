import React, {useState} from 'react';
import {Container, Button, Spinner, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Register.css';
import { registerVoter } from '../utils';


export default function Register(){

    const [walletAddress, setWalletAddress] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        const response = await registerVoter(walletAddress);

        window.alert(response.message);

        setLoading(false);
    }

    return(
        <Container className = "justify-content-center text-center mt-5">
            <Form onSubmit = {event => handleRegister(event)}>
                <div>
                    <h1>Put your address here</h1>
                    <div className = "input-box">
                        <input type = "text" placeholder='0x...' className = "form-control" onChange={evt => setWalletAddress(evt.target.value)}></input>
                        <small>*Please make sure that you are connected</small>   
                    </div>
                    {isLoading ? 
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        <Button className = "btn-dark ms-auto" size = "lg" type = "submit">Submit</Button>
                    }
                </div>
            </Form>
        </Container>
    )
}