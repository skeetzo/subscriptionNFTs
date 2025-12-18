// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BasicToken is ERC20 {

    constructor() ERC20("BasicToken", "BT") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    // function supportsInterface(bytes4 interfaceId) public view virtual override(ERC20) returns (bool) {return super.supportsInterface(interfaceId);}



}