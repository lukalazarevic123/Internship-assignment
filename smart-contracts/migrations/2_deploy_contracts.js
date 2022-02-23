const WakandaVotingPlatform = artifacts.require("WakandaVotingPlatform");
const WKND = artifacts.require("WKND");
const axios = require('axios');

module.exports = async function(deployer){
    await deployer.deploy(WKND);

    const WKNDContract = await WKND.deployed();

    let candidates = await axios.get("https://wakanda-task.3327.io/list");

    candidates = candidates.data['candidates'];

    const allNames = [];
    const allAges = [];
    const allCults = [];

    for(let i = 0; i < candidates.length; i++){
        allNames.push(candidates[i].name);
        allAges.push(candidates[i].age);
        allCults.push(candidates[i].cult);
    }

    await deployer.deploy(WakandaVotingPlatform, WKNDContract.address, allNames, allAges, allCults);

    const WVPContract = await WakandaVotingPlatform.deployed();

    await WKNDContract.authorize(WVPContract.address);
    
}