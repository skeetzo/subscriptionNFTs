// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.25;

// ERC-20 extension providing access to a service or product that requires recurring payments.

interface ISubscriptionERC20 {
  /// @dev map subscribers address, returns address(0) if `idx` is not found
  /// @param idx: the key of the map values
  /// @return the address at key `idx` of subscribers map
  function subscribers(uint idx) external view returns (address);

  /// @dev information of the subscription token contract
  /// @return subscriptionID, subscriptionName, subscriptionDesc, subscriptionTandC
  function subscriptionInfo() external view returns ( uint, string memory, string memory, string memory );

  /// @dev subscribes to the subscription, can be payable
  function subscribe() external;

  /// @dev unsubscribe the subscription
  function unsubscribe() external;

  /// @dev view or pure can be used
  /// @return the subscription fee
  function subscriptionFee() external view returns (uint256);

  /// @dev view or pure can be used
  /// @return get the subscription frequency
  function subscriptionFrequency() external view returns (uint);
}
