// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import "../ERC5643/ERC5643.sol";

contract Mock5643 is ERC5643 {

    uint256 private _tokenIdCounter;

    constructor() ERC4907("Mock", "MOCK") {}

    function mint(address to) public {
        _mint(to, _tokenIdCounter);
        _tokenIdCounter++;
    }

}