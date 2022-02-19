const ethers = require('ethers');
const WakandaVotingPlatform = require('./contract-abi/WakandaVotingPlatform.json')

require('dotenv').config();

const getContract = async () => {
    const provider = new ethers.providers.InfuraProvider(process.env.NETWORKS, process.env.ENDPOINT_KEY);
    let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    
    wallet = wallet.connect(provider);
    
    const contractAddress = WakandaVotingPlatform.networks["4"].address;

    return new ethers.Contract(contractAddress, WakandaVotingPlatform.abi, wallet);
}

const checkAddress = (address) => {
    return ethers.utils.isAddress(address);
}

module.exports = {
    getContract,
    checkAddress
}