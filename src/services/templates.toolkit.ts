export function generateSenderContract(
  contractName: string,
  destinationChainID: string,
  listParams: Array<Record<string, string>>
): string {
  let paramsToSend: string = generateStringParams(listParams);
  return senderTemplate
    .replace(/{{SENDER_CONTRACT_NAME}}/g, contractName)
    .replace(/{{DESTINATION_CHAIN_ID}}/g, destinationChainID)
    .replace(/{{PARAMS_TO_SEND}}/g, paramsToSend);
}

export function generateReceiverContract(
  contractName: string,
  listParams: Array<Record<string, string>>
): string {
  let paramsToReceive: string = generateStringParams(listParams);
  return receiverTemplate
    .replace(/{{RECEIVER_CONTRACT_NAME}}/g, contractName)
    .replace(/{{PARAMS_TO_RECEIVE}}/g, paramsToReceive);
}

// Plantilla del contrato Sender (genérico, sin lógica específica)
export const senderTemplate = `
pragma solidity ^0.8.18;

import "./ITeleporterMessenger.sol";

contract {{SENDER_CONTRACT_NAME}} {
    bytes32 destinationChainID;

    event ParamsSent({{PARAMS_TO_SEND}}, bytes32 messageID);

    ITeleporterMessenger public immutable messenger = ITeleporterMessenger(0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf);

    function sendParamsCrossChain({{PARAMS_TO_SEND}}, address destinationContract) public {
        TeleporterMessageInput memory messageInput = TeleporterMessageInput({
            destinationBlockchainID: {{DESTINATION_CHAIN_ID}},
            destinationAddress: destinationContract,
            feeInfo: TeleporterFeeInfo({feeTokenAddress: address(0), amount: 0}),
            requiredGasLimit: 100000,
            allowedRelayerAddresses: new address ,
            message: abi.encode({{PARAMS_TO_SEND}})
        });

        bytes32 messageID = messenger.sendCrossChainMessage(messageInput);
        emit ParamsSent({{PARAMS_TO_SEND}}, messageID);
    }
}
`;

// Plantilla del contrato Receiver (genérico, sin lógica específica)
export const receiverTemplate = `
pragma solidity ^0.8.18;

import "./ITeleporterMessenger.sol";
import "./ITeleporterReceiver.sol";

contract {{RECEIVER_CONTRACT_NAME}} is ITeleporterReceiver {
    ITeleporterMessenger public immutable messenger = ITeleporterMessenger(0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf);

    event ParamsReceived({{PARAMS_TO_RECEIVE}});

    function receiveTeleporterMessage(bytes32, address, bytes calldata message) external {
        require(msg.sender == address(messenger), "Unauthorized TeleporterMessenger");

        {{PARAMS_TO_RECEIVE}} = abi.decode(message, ({{PARAMS_TO_RECEIVE}}));

        emit ParamsReceived({{PARAMS_TO_RECEIVE}});
    }
}
`;

export function generateStringParams(
  listParams: Array<Record<string, string>>
): string {
  let baseString = "";
  let separator = ", ";

  for (let i = 0; i < listParams.length; i++) {
    baseString += listParams[i]["type"] + " " + listParams[i]["name"];
    if (i < listParams.length - 1) {
      baseString += separator;
    }
  }
  return baseString;
}

//const senderContract = generateSenderContract("MySenderContract", "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234", "uint256 param1, address param2");
//const receiverContract = generateReceiverContract("MyReceiverContract", "uint256 param1, address param2");

export const ITeleporterMessenger = `
// (c) 2023, Ava Labs, Inc. All rights reserved.
// See the file LICENSE for licensing terms.

// SPDX-License-Identifier: Ecosystem

pragma solidity 0.8.18;

// A message receipt identifies the message that was delivered by its nonce,
// and the address that can redeem the reward for that message.
struct TeleporterMessageReceipt {
    uint256 receivedMessageNonce;
    address relayerRewardAddress;
}

// Represents all of the information required for submitting a Teleporter message
// to be sent to the given destination chain ID and address. Includes the fee
// information for the message, the amount of gas the relayer must provide to execute
// the message on the destination chain, the relayer accounts allowed to deliver the
// message, and the message data itself.
struct TeleporterMessageInput {
    bytes32 destinationBlockchainID;
    address destinationAddress;
    TeleporterFeeInfo feeInfo;
    uint256 requiredGasLimit;
    address[] allowedRelayerAddresses;
    bytes message;
}

// Represents a message sent or received by an implementation of {ITeleporterMessenger}.
struct TeleporterMessage {
    uint256 messageNonce;
    address originSenderAddress;
    bytes32 destinationBlockchainID;
    address destinationAddress;
    uint256 requiredGasLimit;
    address[] allowedRelayerAddresses;
    TeleporterMessageReceipt[] receipts;
    bytes message;
}

// Represents the fee information associated to a given Teleporter message.
// The contract address is the asset contract the fee will be paid in, and
// the amount is the amount of that specified asset.
struct TeleporterFeeInfo {
    address feeTokenAddress;
    uint256 amount;
}

/**
 * @dev Interface that describes functionalities for a cross-chain messenger implementing the Teleporter protcol.
 *
 * @custom:security-contact https://github.com/ava-labs/teleporter/blob/main/SECURITY.md
 */
interface ITeleporterMessenger {

    event BlockchainIDInitialized(bytes32 indexed blockchainID);

    event SendCrossChainMessage(
        bytes32 indexed messageID,
        bytes32 indexed destinationBlockchainID,
        TeleporterMessage message,
        TeleporterFeeInfo feeInfo
    );

    event AddFeeAmount(bytes32 indexed messageID, TeleporterFeeInfo updatedFeeInfo);

    event MessageExecutionFailed(
        bytes32 indexed messageID, bytes32 indexed sourceBlockchainID, TeleporterMessage message
    );

    event MessageExecuted(bytes32 indexed messageID, bytes32 indexed sourceBlockchainID);

    event ReceiveCrossChainMessage(
        bytes32 indexed messageID,
        bytes32 indexed sourceBlockchainID,
        address indexed deliverer,
        address rewardRedeemer,
        TeleporterMessage message
    );

    event ReceiptReceived(
        bytes32 indexed messageID,
        bytes32 indexed destinationBlockchainID,
        address indexed relayerRewardAddress,
        TeleporterFeeInfo feeInfo
    );

    event RelayerRewardsRedeemed(address indexed redeemer, address indexed asset, uint256 amount);

    function sendCrossChainMessage(TeleporterMessageInput calldata messageInput)
        external
        returns (bytes32);

    function retrySendCrossChainMessage(TeleporterMessage calldata message) external;

    function addFeeAmount(
        bytes32 messageID,
        address feeTokenAddress,
        uint256 additionalFeeAmount
    ) external;

    function receiveCrossChainMessage(uint32 messageIndex, address relayerRewardAddress) external;

    function retryMessageExecution(
        bytes32 sourceBlockchainID,
        TeleporterMessage calldata message
    ) external;

    function sendSpecifiedReceipts(
        bytes32 sourceBlockchainID,
        bytes32[] calldata messageIDs,
        TeleporterFeeInfo calldata feeInfo,
        address[] calldata allowedRelayerAddresses
    ) external returns (bytes32);

    function redeemRelayerRewards(address feeTokenAddress) external;

    function getMessageHash(bytes32 messageID) external view returns (bytes32);

    function messageReceived(bytes32 messageID) external view returns (bool);

    function getRelayerRewardAddress(bytes32 messageID) external view returns (address);

    function checkRelayerRewardAmount(
        address relayer,
        address feeTokenAddress
    ) external view returns (uint256);

    function getFeeInfo(bytes32 messageID) external view returns (address, uint256);

    function getNextMessageID(bytes32 destinationBlockchainID) external view returns (bytes32);

    function getReceiptQueueSize(bytes32 sourceBlockchainID) external view returns (uint256);

    function getReceiptAtIndex(
        bytes32 sourceBlockchainID,
        uint256 index
    ) external view returns (TeleporterMessageReceipt memory);
}
`;

export const ITeleporterReceiver = `
// (c) 2022-2023, Ava Labs, Inc. All rights reserved.
// See the file LICENSE for licensing terms.

// SPDX-License-Identifier: Ecosystem

pragma solidity 0.8.18;

/**
 * @dev Interface that cross-chain applications must implement to receive messages from Teleporter.
 *
 * @custom:security-contact https://github.com/ava-labs/teleporter/blob/main/SECURITY.md
 */
interface ITeleporterReceiver {
    /**
     * @dev Called by TeleporterMessenger on the receiving chain.
     *
     * @param sourceBlockchainID is provided by the TeleporterMessenger contract.
     * @param originSenderAddress is provided by the TeleporterMessenger contract.
     * @param message is the TeleporterMessage payload set by the sender.
     */
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external;
}
`;
