//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

contract WKND is ERC20Burnable{


    address public owner;
    mapping(address => bool) public authorized;

    constructor() public ERC20("Wakanda Voting Token", "WKND"){
        owner = msg.sender;
    }

    function isAuthorized(address _spender) public view returns(bool){
        return authorized[_spender];
    }

    function authorize(address _spender) public {
        require(msg.sender == owner, "WKND::authorize: Only owner can authorize actions!");
        require(!authorized[_spender], "WKND::authorize: Address already authorized!");

        authorized[_spender] = true;
    }

    function decimals() override public view returns(uint8){
        return 0;
    }

    function mint(address to) external{
        require(authorized[msg.sender], "WKND::mint: Only authorized addresses can mint tokens!");

        _mint(to, 1);
    }

    function burn(address from, uint amount) public {
        require(authorized[msg.sender], "WKND::burn: Only authorized addresses can burn tokens!");

        _burn(from, amount);
    }
}