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

}

export const getCandidates = () => {
        // const response = await fetch("https://wakanda.zmilos.com/list/");
        // const candidates = await response.json();

        return [{name: "Luka", age: 20, cult: "SSZK"}, {name: "John", age: 20, cult: "KK Zorka"}];
}