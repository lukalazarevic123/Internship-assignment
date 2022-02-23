import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Header.css';
import {Link} from 'react-router-dom';
import {Navbar, Nav, Button} from 'react-bootstrap';

export default function Header(){

    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);
    

    const connectWallet = async () => {

        if(window.ethereum && window.ethereum.isMetaMask){
            await window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                if(result.length !== 0){
                    accountHandler(result[0]);
                    setConnected(true);
                }

            }).catch(error => {
                window.alert(error.message)

            });
        }else{
            window.alert("Please install MetaMask");
        }
        
    }

    const accountHandler = (newAccount) => {
        setAccount(newAccount);
    }

    window.ethereum.on('accountsChanged', accountHandler);

    useEffect(() => {
        if(window.ethereum.isConnected()){
            connectWallet();
        }
    }, [])


    return (
        <Navbar bg = 'dark' variant = 'dark' className = "text-light">
            <Navbar.Brand as = {Link} to = '/' >Home</Navbar.Brand>
            <Nav.Link as = {Link} to = '/register' >Register</Nav.Link>
            <Nav.Link as = {Link} to = '/vote' >Vote</Nav.Link>
            <Button className = "btn-dark btn-outline-light ms-auto" size = "md" hidden = {connected} onClick = {connectWallet}>Connect</Button>
            <div className = "wallet-address ms-auto" hidden = {!connected}>{account}</div>
        </Navbar>
    )
}
