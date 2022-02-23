import React, {useState,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Vote.css';
import { Container, Row, Col,FormSelect, FormControl, InputGroup, Button, Form, Spinner } from "react-bootstrap";
import { getCandidates, showLeads, vote } from "../utils";
import LeadingTable from "./LeadingTable";


export default function Vote(){

    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [voteAmount, setVoteAmount] = useState(0);
    const [leaders, setLeaders] = useState([]);
    const [isLoadingVote, setLoadingVote] = useState(false);

    const getLeaders = async () => {
        const leading = await showLeads();

        setLeaders(leading);
    }

    const handleVote = async (event) => {
        event.preventDefault();
        setLoadingVote(true);

        const response = await vote(selected, voteAmount);

        window.alert(response.message);

        setLoadingVote(false);
    }

    useEffect(async () => {
        const kandidati = await getCandidates();
        setCandidates(kandidati);
    }, [])

    return(
        <Container className = "justify-content-center text-center mt-5">
            <Row>
                <Col>
                <Form  onSubmit = {event => handleVote(event)}>
                    <div className = "content-form">
                        <p>Please select the candidate you want to vote for:</p>
                        <FormSelect variant = "dark" className = "candidates bg-dark text-white" sz = "sm" onChange = {event => setSelected(event.target.value)} required>
                            <option value = "">Select a candidate</option>
                            {candidates.map(candidate => 
                                <option key = {candidates.indexOf(candidate)} value = {candidates.indexOf(candidate)}>{candidate.name}, {candidate.age}, {candidate.cult}</option>
                            )}
                        </FormSelect>
                        <p>Please enter the amount of votes you want to cast:</p>
                        <InputGroup className = "vote-amount">
                            <InputGroup.Text>WKND</InputGroup.Text>
                            <FormControl placeholder = "amount" type = "number" min = "0" onChange = {event => setVoteAmount(event.target.value)} required></FormControl>
                        </InputGroup>
                        <div className = "btn-spin">
                            {isLoadingVote?
                                <Spinner animation="border" role="status" variant = "white">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                :
                                <Button className = "ms-auto mt-3" variant = "dark" size = "lg" type= "submit">Vote</Button>
                            }
                        </div>
                    </div>
                </Form>
                </Col>
            <Col>
                <div className = "content-form">
                    <Button className = "mb-3" variant = "dark" size = "lg" onClick = {getLeaders}>Show Leads</Button>
                    <LeadingTable leaders = {leaders}/>
                </div>
            </Col>
            
            </Row>
        </Container>
    );
}
