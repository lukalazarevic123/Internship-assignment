# Internship-assignment

## Description

As a part of the admission process for MVPW/3327 I've created a DAPP used for elections.

This platform contains the following: 
  - User interface used to register and vote
  - Smart contract used for voting
  - ERC20Burnable token (WKND) that is used as a confirmation that the user has actually registered to vote
  - Local NodeJS server used as a backup device that assists in voting

## Installation guide

To successfully install every part of the project you will need the following: 
  - Node package manager
  - PostgreSQL 
  - Metamask browser plugin


## Frontend 

To run the frontend of the application, follow the instructions:
  - Navigate to the frontend folder
  - Run ```npm install``` from the terminal
  - In the ```config.js``` change the ```SERVER_PORT``` to the value that you are going to use for the server

## Backend

To run the backend of the application, follow the instructions: 
  - Navigate to the backend folder
  - Run ```npm install``` command from the terminal
  - Create a ```.env``` file and fill it out just like the ```.env.example```
  - To run the server, run ```node server``` from the terminal

## Smart-Contracts

To deploy your versions of the contracts, follow the instructions: 
  - Run ```npm install``` from the terminal
  - Create a ```.env``` file and fill it out just like the ```.env.example```
  
If you choose to deploy your versions of the contracts run: 
```truffle migrate --reset --compile-all --network rinkeby```

Once the migration is done you will need to copy the ```WKND.json``` and ```WakandaVotingPlatform.json``` in the ```frontend/src/contract-abis```
and ```backend/contract-abi```
