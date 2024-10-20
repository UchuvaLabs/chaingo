// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ITeleporterMessenger.sol";

/* Your sc */
contract SimpleGame {
    address public lastWinner;
    bytes32 destinationChainID;

    event GamePlayed(address player1, address player2, address winner);
    event WinnerSent(address winner, bytes32 messageID);

    ITeleporterMessenger public immutable messenger = ITeleporterMessenger(0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf);

    function playGame(address player1, address player2, address winnerContractAddress) public {
        require(player1 != player2, "The addresses must be different.");
        require(player1 != address(0) && player2 != address(0), "Invalid addresses.");

        uint256 randomResult = uint256(keccak256(abi.encodePacked(block.timestamp, player1, player2))) % 2;

        address winner = randomResult == 0 ? player1 : player2;
        lastWinner = winner;

        emit GamePlayed(player1, player2, winner);

        // Send the winner to the C-Chain
        sendWinnerCrossChain(winner, winnerContractAddress);
    }

    function sendWinnerCrossChain(address winner, address winnerContractAddress) internal {
        // Send the winner address directly without converting to string
        TeleporterMessageInput memory messageInput = TeleporterMessageInput({
            destinationBlockchainID: 0x172c2c69ee5a56edcdfd3eb09cb055ae8a8ea40390dc30c83aac411f2a58652a,
            destinationAddress: winnerContractAddress,
            feeInfo: TeleporterFeeInfo({feeTokenAddress: address(0), amount: 0}),
            requiredGasLimit: 100000,
            allowedRelayerAddresses: new address[](0),
            message: abi.encode(winner) // Sending the address directly
        });

        bytes32 messageID = messenger.sendCrossChainMessage(messageInput);
        emit WinnerSent(winner, messageID);
    }

    function getLastWinner() public view returns (address) {
        return lastWinner;
    }
}