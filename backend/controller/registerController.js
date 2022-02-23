const {getContract, checkAddress} = require('./blockchainController');

module.exports.register = async (req, res) => {
    const { walletAddress } = req.body;
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
        
        const registered = await votingContract.isRegistered(walletAddress);

        if(registered){
            res.json({message: "You are already registered"});
            return;
        }

        var gasEstimate = await votingContract.estimateGas.registerVoter(walletAddress);
        gasEstimate = parseInt(gasEstimate) + 10000;

        votingContract.registerVoter(walletAddress, {gasLimit: parseInt(gasEstimate)}).then(() => {
            res.json({message: "Registration successful"})
            return;
        });

    } catch (error) {
        res.json({
            message: "Something went wrong. Your voting data is stored and will be submited once the connection is established"
        })
        console.log(error.message);
    }

}