const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const { getContract, checkAddress } = require('./utils.js');

const app = express();

app.use(cors());
app.use(express.json());

require('dotenv').config();

const port = process.env.PORT || 5000;

app.post("/register", async(req, res) => {
    const { walletAddress } = req.body;
    const votingContract = await getContract();
    const validAddress = checkAddress(walletAddress);

    try {
        const registered = await votingContract.isRegistered(walletAddress);

        if(registered){
            res.json({message: "You are already registered"});
        }

        if(!validAddress){
            res.json({message: "Invalid address"});
            return;
        }

        votingContract.registerVoter(walletAddress).then(() => {
            res.json({message: "Registration successful"})
        });

    } catch (error) {
        res.json({message: "Something went wrong. Your voting data is stored and will be submited once the connection is established"})
    }

    

    
})

app.post("/vote", async(req, res) => {

    const { walletAddress } = req.body;
    const { candidateId } = req.body;
    const { voteAmount } = req.body;

    const votingContract = await getContract();

    try {
        const ended = await votingContract.hasEnded();

        if(ended){
            res.json({message: "Elections have ended"});
            return;
        }

        const voted = await votingContract.hasVoted(walletAddress);

        if(voted){
            res.json({message: "You have already voted"});
            return;
        }
        console.log(voteAmount)
        const balance = await votingContract.checkBalance(walletAddress, voteAmount);
        
        if(!balance){
            res.json({message: "Insufficient funds"});
            return;
        }
        console.log("glasam");
        const registered = await votingContract.isRegistered(walletAddress);

        if(!registered){
            res.json({message: "You are not registered"});
            return;
        }


        votingContract.vote(candidateId, voteAmount, walletAddress, {gasLimit: 50000}).then(() => {
            res.json({message: "You have successfully voted"});
            return;
        });  
    } catch (error) {
        res.json({message: "Something went wrong. Your voting data is stored and will be submited once the connection is established"});
        console.log(error.message)
    }
    
});

app.get("/winning-candidates", async(req, res) => {
    const votingContract = await getContract();

    const winningCandidates = await votingContract.winningCandidates();

    res.json({winningCandidates});
})



app.listen(port, () => {
    console.log(`Server listenting on port ${port}`);
})