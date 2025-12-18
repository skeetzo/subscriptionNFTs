// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC5643.sol";

contract ERC5643 is ERC721, IERC5643 {

    error SubscriptionNotRenewable();

    mapping(uint256 => uint64) private _expirations;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function renewSubscription(uint256 tokenId, uint64 duration) virtual public payable {
        uint64 currentExpiration = _expirations[tokenId];
        uint64 newExpiration;
        if (currentExpiration == 0) {
            newExpiration = uint64(block.timestamp) + duration;
        } else {
            if (!isRenewable(tokenId)) {
                revert SubscriptionNotRenewable();
            }
            newExpiration = currentExpiration + duration;
        }

        _expirations[tokenId] = newExpiration;

        emit SubscriptionUpdate(tokenId, newExpiration);
    }

    function cancelSubscription(uint256 tokenId) virtual public {
        require(_ownerOf(tokenId) != address(0x0), "Token must exist");
        require(_isAuthorized(_ownerOf(tokenId), msg.sender, tokenId), "Caller is not owner nor approved");
        delete _expirations[tokenId];
        emit SubscriptionUpdate(tokenId, 0);
        _burn(tokenId);
    }

    function expiresAt(uint256 tokenId) public view returns(uint64) {
        return _expirations[tokenId];
    }

    function isRenewable(uint256 /*tokenId*/) virtual public pure returns(bool) {
        return true;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC5643).interfaceId || super.supportsInterface(interfaceId);
    }
}
