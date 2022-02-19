//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IWakandaVotingPlatform.sol';
import './WKND.sol';

contract WakandaVotingPlatform is IWakandaVotingPlatform{

    address public owner;
    WKND public token;

    bool public hasEnded;

    mapping(address => bool) registeredVoters;
    mapping(address => bool) voted;

    Candidate[] candidates;
    uint256[] public leadingCandidates;

    constructor (WKND _token){
        owner = msg.sender;
        token = _token;
    }

    function isRegistered(address voterAddress) override public view returns (bool){
        return registeredVoters[voterAddress];
    }

    function registerVoter(address voterAddress) override external { 
        require(!isRegistered(voterAddress), "WakandaVotingPlatform::registerVoter: Voter already registered");
        require(!hasEnded, "WakandaVotingPlatform::registerVoter: Election has ended");
        
        registeredVoters[voterAddress] = true;
        token.mint(voterAddress);
    }

    function checkBalance(address voterAddress, uint256 amount) override public view returns(bool){
        return amount > 0 && token.balanceOf(voterAddress) >= amount;
    }

    //check if the candidate is already in a leading position
    function isLeading(uint256 candidateId) internal view returns(bool){
        for(uint i = 0; i < leadingCandidates.length; i++){
            if(leadingCandidates[i] == candidateId)
                return true;
        }

        return false;
    }

    //returns true if the candidate has potential to enter a leading position
    function hasPotential(uint256 candidateId) internal view returns(bool){
        if(leadingCandidates.length > 0){
            return candidates[candidateId].votes > leadingCandidates[leadingCandidates.length-1] ? true : false;
        }
    }

    function sortLeading() internal {
        for(uint i = 0; i < leadingCandidates.length-1; i++){
            for(uint j = 0; j < leadingCandidates.length-i-1; j++){
                if(candidates[leadingCandidates[j]].votes < candidates[leadingCandidates[j+1]].votes){
                    uint256 tmp = leadingCandidates[j];
                    leadingCandidates[j] = leadingCandidates[j+1];
                    leadingCandidates[j+1] = tmp;
                }
            }
        }
    }

    function pushToLeading(uint256 candidateId) internal {
        if(leadingCandidates.length < 3){
            leadingCandidates.push(candidateId);
        }else{
            leadingCandidates[2] = candidateId;
            sortLeading();
        }

        emit NewChallenger(candidates[candidateId]);
    }

    function hasVoted(address voterAddress) override public view returns(bool){
        return voted[voterAddress];
    }

    function vote(uint256 candidateId, uint256 voteAmount, address voterAddress) override external{
        require(!hasEnded, "WakandaVotingPlatform::vote: Election has ended");
        require(!hasVoted(voterAddress), "WakandaVotingPlatform::vote: You have already voted");
        require(checkBalance(voterAddress, voteAmount), "WakandaVotingPlatform::vote: Insufficient funds");
        require(candidateId >= 0 && candidateId < candidates.length, "WakandaVotingPlatform::vote: Invalid candidate ID");

        token.burn(voterAddress, voteAmount);
        candidates[candidateId].votes+=voteAmount;

        if(!isLeading(candidateId) && (leadingCandidates.length < 3 || hasPotential(candidateId))){
            pushToLeading(candidateId);
        }else{
            sortLeading();
        }

        voted[voterAddress] = true;
    }

    function winningCandidates() override external view returns(Candidate[] memory){
        Candidate[] memory leading = new Candidate[];

        for(uint i = 0; i < leadingCandidates.length; i++){
            leading[i] = candidates[leadingCandidates[i]];
        }

        return leading;
    }

    function endElection() override external {
        require(msg.sender == owner, "WakandaVotingPlatform::endElection: Only owner can end the election");

        hasEnded = true;
    }
}