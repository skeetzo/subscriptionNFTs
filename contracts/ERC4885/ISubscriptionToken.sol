// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.25;


// Streaming services
// Club memberships
// Season tickets etc.

// Other use cases I see are:
// Renting of digital assets
// Fixed rate to variable income in DeFi

// https://eips.ethereum.org/EIPS/eip-4885
interface ISubscriptionToken {
    /**
        @dev This emits when the subscription token constructor or initialize method is
        executed.
        @param name The name of the subscription token
        @param symbol The symbol of the subscription token
        @param provider The provider of the subscription whom receives the deposits
        @param subscriptionToken The subscription token contract address
        @param baseToken The ERC-20 compatible token to use for the deposits.
        @param nft Address of the `nft` contract that the provider mints/transfers from.
        All tokenIds referred to in this interface MUST be token instances of this `nft` contract.
    */
    event InitializeSubscriptionToken(
        string name,
        string symbol,
        address provider,
        address indexed subscriptionToken,
        address indexed baseToken,
        address indexed nft,
        string uri
    );

    /**
        @dev This emits for every new subscriber to `nft` contract of token `tokenId`.
        `subscriber` MUST have received `nft` of token `tokenId` in their account.
        @param subscriber The subscriber account
        @param tokenId MUST be token id of `nft` sent to `subscriber`
        @param uri MUST be uri of the `nft` that was sent to `subscriber` or empty string
    */
    event SubscribeToNFT(
        address indexed subscriber,
        uint256 indexed tokenId,
        string uri
    );

    /**
        @dev Emits when `subscriber` deposits ERC-20 of token type `baseToken` via the `deposit method.
        This tops up `subscriber` balance of subscription tokens
        @param depositAmount The amount of ERC-20 of type `baseToken` deposited
        @param subscriptionTokenAmount The amount of subscription tokens sent in exchange to `subscriber`
        @param subscriptionPeriod Amount of additional time in seconds subscription is extended
    */
    event Deposit(
        address indexed subscriber,
        uint256 indexed tokenId,
        uint256 depositAmount,
        uint256 subscriptionTokenAmount,
        uint256 subscriptionPeriod
    );

    /**
        @return The name of the subscription token
    */
    function name() external view returns (string memory);

    /**
        @return The symbol of the subscription token
    */
    function symbol() external view returns (string memory);

    /**
        @notice Subscribes `subscriber` to `nft` of 'tokenId'. `subscriber` MUST receive `nft`
        of token `tokenId` in their account.
        @dev MUST revert if `subscriber` is already subscribed to `nft` of 'tokenId'
        MUST revert if 'nft' has not approved the `subscriptionToken` contract address as operator.
        @param subscriber The subscriber account. MUST revert if zero address.
        @param tokenId MUST be token id of `nft` contract sent to `subscriber`
        `tokenId` emitted from event `SubscribeToNFT` MUST be the same as tokenId except when
        tokenId is zero; allows OPTIONAL tokenid that is then set internally and minted by
        `nft` contract
        @param uri The OPTIONAL uri of the `nft`.
        `uri` emitted from event `SubscribeToNFT` MUST be the same as uri except when uri is empty.
    */
    function subscribeToNFT(
        address subscriber,
        uint256 tokenId,
        string memory uri
    ) external;

    /**
        @notice Top up balance of subscription tokens held by `subscriber`
        @dev MUST revert if `subscriber` is not subscribed to `nft` of 'tokenId'
        MUST revert if 'nft' has not approved the `subscriptionToken` contract address as operator.
        @param subscriber The subscriber account. MUST revert if zero address.
        @param tokenId The token id of `nft` contract to subscribe to
        @param depositAmount The amount of ERC-20 token of contract address `baseToken` to deposit
        in exchange for subscription tokens of contract address `subscriptionToken`
    */
    function deposit(
        address subscriber,
        uint256 tokenId,
        uint256 depositAmount
    ) external payable;

    /**
        @return The balance of subscription tokens held by `subscriber`.
        RECOMMENDED that the balance decreases linearly to zero for time limited subscriptions
        RECOMMENDED that the balance remains the same for life long subscriptions
        MUST return zero balance if the `subscriber` does not hold `nft` of 'tokenId'
        MUST revert if subscription has not yet started via the `deposit` function
        When the balance is zero, the use of `nft` of `tokenId` MUST NOT be allowed for `subscriber`
    */
    function balanceOf(address subscriber) external view returns (uint256);
}
