export function generateSenderContract(contractName: string, destinationChainID: string, listParams: Array<Record<string, string>>): string {
    let paramsToSend: string = generateStringParams(listParams);
    return senderTemplate
        .replace("{{SENDER_CONTRACT_NAME}}", contractName)
        .replace("{{DESTINATION_CHAIN_ID}}", destinationChainID)
        .replace("{{PARAMS_TO_SEND}}", paramsToSend);
}

export function generateReceiverContract(contractName: string, listParams: Array<Record<string, string>>): string {
    let paramsToReceive: string = generateStringParams(listParams);
    return receiverTemplate
        .replace("{{RECEIVER_CONTRACT_NAME}}", contractName)
        .replace("{{PARAMS_TO_RECEIVE}}", paramsToReceive);
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

export function generateStringParams(listParams: Array<Record<string, string>>): string{
    let baseString= "";
    let separator = ", ";
    for(let i=0; i<listParams.length; i++){
        if (i<listParams.length){
            separator="";
        }
        baseString = baseString + listParams[i]["type"] + " " + listParams[i]["name"] + separator;
    }
    return baseString;
}


//const senderContract = generateSenderContract("MySenderContract", "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234", "uint256 param1, address param2");
//const receiverContract = generateReceiverContract("MyReceiverContract", "uint256 param1, address param2");
