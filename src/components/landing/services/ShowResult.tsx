import { useState } from "react";
import { FaClipboard } from "react-icons/fa";

const ShowResult = () => {
  const [isCopiedSend, setIsCopiedSend] = useState(false);
  const [isCopiedReceive, setIsCopiedReceive] = useState(false);


  const handleCopy = (text: string, setIsCopied: (state: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const sendSmartContractCode = `contract SimpleGame {
    address public lastWinner;
    address winnerContractAddress;
    bytes32 destinationChainID;
    ITeleporterMessenger teleporterMessenger;

    event GamePlayed(address player1, address player2, address winner);

    function playGame(address player1, address player2) public {
        require(player1 != player2, "The addresses must be different.");
        require(player1 != address(0) && player2 != address(0), "Invalid addresses.");

        uint randomResult = uint(keccak256(abi.encodePacked(block.timestamp, player1, player2))) % 2;

        address winner = randomResult == 0 ? player1 : player2;
        lastWinner = winner;

        emit GamePlayed(player1, player2, winner);
    }

    function getLastWinner() public view returns (address) {
        return lastWinner;
    }
}`;
  const receiveSmartContractCode = `contract Receiver {
    function onReceive(address sender, bytes memory data) public {
        // handle received data
    }
}`;

  return (
    <section className="bg-background p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h1 className="text-3xl font-extrabold text-accent text-center mb-8">
        Your Smart Contracts
      </h1>

      {/* Contenedor flex para poner los contratos uno al lado del otro */}
      <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
        {/* Send Smart Contract */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-primaryText mb-4">
            Send Smart Contract
          </h2>
          <div className="bg-gray-900 text-secondaryText p-6 rounded-lg shadow-inner relative">
            <pre className="whitespace-pre-wrap break-all overflow-x-auto text-sm leading-relaxed">
              <code className="text-codeHighlight">
                {sendSmartContractCode}
              </code>
            </pre>
            {/* Botón de copiar con ícono */}
            <button
              onClick={() => handleCopy(sendSmartContractCode, setIsCopiedSend)}
              className={`absolute top-2 right-2 p-3 rounded-lg transition-colors hover:bg-[#d99a07] duration-300 focus:outline-none ${
                isCopiedSend ? "bg-green-500" : "bg-accent"
              }`}
            >
              <FaClipboard className="text-background" />
            </button>
          </div>
        </div>

        {/* Receive Smart Contract */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-primaryText mb-4">
            Receive Smart Contract
          </h2>
          <div className="bg-gray-900 text-secondaryText p-6 rounded-lg shadow-inner relative">
            <pre className="whitespace-pre-wrap break-all overflow-x-auto text-sm leading-relaxed">
              <code className="text-codeHighlight">
                {receiveSmartContractCode}
              </code>
            </pre>

            <button
              onClick={() =>
                handleCopy(receiveSmartContractCode, setIsCopiedReceive)
              }
              className={`absolute top-2 right-2 p-3 rounded-lg transition-colors hover:bg-[#d99a07] duration-300 focus:outline-none ${
                isCopiedReceive ? "bg-green-500" : "bg-accent"
              }`}
            >
              <FaClipboard className="text-background" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowResult;
