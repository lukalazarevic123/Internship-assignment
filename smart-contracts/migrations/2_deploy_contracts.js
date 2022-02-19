const WakandaVotingPlatform = artifacts.require("WakandaVotingPlatform");
const WKND = artifacts.require("WKND");

module.exports = async function(deployer){
    await deployer.deploy(WKND);

    const WKNDContract = await WKND.deployed();

    await deployer.deploy(WakandaVotingPlatform, WKNDContract.address);

    const WVPContract = await WakandaVotingPlatform.deployed();

    await WKNDContract.authorize(WVPContract.address);
    
}