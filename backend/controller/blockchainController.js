const ethers = require('ethers');
const crypto = require('crypto');
const WakandaVotingPlatform = require('../contract-abi/WakandaVotingPlatform.json')


require('dotenv').config();

module.exports.getContract = async () => {
    const provider = new ethers.providers.InfuraProvider(process.env.NETWORKS, process.env.ENDPOINT_KEY);
    let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    
    wallet = wallet.connect(provider);
    
    const contractAddress = WakandaVotingPlatform.networks["4"].address;

    return new ethers.Contract(contractAddress, WakandaVotingPlatform.abi, wallet);
}

module.exports.checkAddress = (address) => {
    return ethers.utils.isAddress(address);
}

module.exports.winningCandidates = async(req, res) => {
    const contract = await this.getContract();

    const leaders = await contract.winningCandidates();

    res.json({leaders});
}

module.exports.encrypt = (data) => {
    const IV_LENGTH = parseInt(process.env.IV_LENGTH);
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(data);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

module.exports.decrypt = (hash) => {
    let parts = hash.split(':');
    let iv = Buffer.from(parts.shift(), 'hex');
    let encryptedData = Buffer.from(parts.join(':'), 'hex');

    let decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM, Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedData);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}