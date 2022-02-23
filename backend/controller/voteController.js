const { getContract, checkAddress, encrypt, decrypt } = require('../controller/blockchainController');
const pool = require('../db');


module.exports.regularVote = async (req, res) => {
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

        const validAddress = checkAddress(walletAddress);

        if(!validAddress){
            res.json({message: "Invalid address"});
            return;
        }

        const voted = await votingContract.hasVoted(walletAddress);

        if(voted){
            res.json({message: "You have already voted"});
            return;
        }

        const balance = await votingContract.checkBalance(walletAddress, voteAmount);
        
        if(!balance){
            res.json({message: "Insufficient funds"});
            return;
        }

        const registered = await votingContract.isRegistered(walletAddress);

        if(!registered){
            res.json({message: "You are not registered"});
            return;
        }

        var gasEstimate = await votingContract.estimateGas.vote(candidateId, voteAmount, walletAddress);
        gasEstimate = parseInt(gasEstimate) + 10000;

        votingContract.vote(candidateId, voteAmount, walletAddress, {gasLimit: gasEstimate}).then(() => {
            res.json({message: "You have successfully voted"});
            return;
        });  
    } catch (error) {

        var data = {walletAddress, candidateId, voteAmount};
        const encryptData = encrypt(JSON.stringify(data));

        const cachedVoted = await pool.query(
            "INSERT INTO votes (voteData, processed, voteStatus) VALUES ($1, $2, $3) RETURNING *",
            [encryptData, false, "NOT_PROCESSED"]
        );

        res.json({
            message: "Something went wrong. Your voting data is stored and will be submited once the connection is established. If the data is correct the vote will be submitted."
        });
    }
}

/*
try and get all cached votes that are not processed
if voting is successful patch processed to true
if not just continue
*/

module.exports.cachedVotes = async () => {
    try{
        
        const votingContract = await getContract();
        const votes = await pool.query(
            "SELECT * FROM votes WHERE processed = $1",
            [false]
        );

        for(let i = 0; i < votes.rows.length; i++){
            const cachedData = votes.rows[i];
            const voteData = JSON.parse(decrypt(cachedData.votedata));

            const {walletAddress} = voteData;
            const {voteAmount} = voteData;
            const {candidateId} = voteData;

            try{

                const ended = await votingContract.hasEnded();
                const validAddress = checkAddress(walletAddress);
                const voted = await votingContract.hasVoted(walletAddress);
                const balance = await votingContract.checkBalance(walletAddress, voteAmount);
                const registered = await votingContract.isRegistered(walletAddress);

                if(ended || !validAddress || voted || !balance || !registered){
                    const processVote = await pool.query(
                        "UPDATE votes SET processed = $1, voteStatus = $2 WHERE voteId = $3",
                        [true, "INVALID_DATA", cachedData.voteid]
                    );
                    continue;
                }

                var gasEstimate = await votingContract.estimateGas.vote(candidateId, voteAmount, walletAddress);
                gasEstimate = parseInt(gasEstimate) + 10000;

                votingContract.vote(candidateId, voteAmount, walletAddress, {gasLimit: gasEstimate}).then(async () => {
                    const processVote = await pool.query(
                        "UPDATE votes SET processed = $1, voteStatus = $2 WHERE voteId = $3",
                        [true, "SUCCESSFUL_VOTE", cachedData.voteid]
                    );
                });
                

            }catch(error){
                console.log(error.message);
            }
        }
    }catch(error){
        console.log(error.message);
    }
}