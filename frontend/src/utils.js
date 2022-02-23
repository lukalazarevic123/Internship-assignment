const axios = require('axios');
const ethers = require('ethers');

const port = 5000;

export const getProvider = () => {
    if(window.ethereum && window.ethereum.isMetaMask){
        return new ethers.providers.Web3Provider(window.ethereum);
    }
}

export const registerVoter = async (walletAddress) => {

    try{
        const response = await axios.post(`http://localhost:${port}/register`, { walletAddress });

        return response.data;
    }catch(err){
        console.log(err);
    }

}

export const vote = async (candidateId, voteAmount) => {

    const provider = getProvider();
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    try{
        const response = await axios.post(`http://localhost:${port}/vote`, {
            candidateId,
            voteAmount,
            walletAddress
        })

        return response.data;
    }catch(error){
        console.log(error);
    }

}

export const showLeads = async () => {
    try{
        const leads = await axios.get(`http://localhost:${port}/winning-candidates`);

        const winningCandidates = [];

        for(let i = 0; i < leads.data.leaders.length; i++){
            if(leads.data.leaders[i][0] === '') continue;
            winningCandidates.push({
                name: leads.data.leaders[i][0],
                age: parseInt(leads.data.leaders[i][1].hex, 16),
                cult: leads.data.leaders[i][2],
                votes: parseInt(leads.data.leaders[i][3].hex, 16)
            });
        }

        return winningCandidates;
    }catch(error){
        console.log(error.message);
    }
}

export const getCandidates = async () => {
        const candidates = await axios.get("https://wakanda-task.3327.io/list");

        return  candidates.data['candidates'];
}