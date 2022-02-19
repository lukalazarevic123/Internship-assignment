//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWakandaVotingPlatform {

    struct Candidate{
        string name;
        uint256 age;
        string cult;
        uint256 votes;
    }

    event NewChallenger(Candidate newChallenger);

    function registerVoter(address voterAddress) external;
    function isRegistered(address voterAddress) external view returns (bool);

    function vote(uint256 candidateId, uint256 voteAmount, address voterAddress) external;
    function checkBalance(address voterAddress, uint256 voteAmount) external view returns (bool);
    function hasVoted(address voterAddress) external view returns (bool);

    function winningCandidates() external view returns (Candidate[] memory);
    
    function endElection() external;
}