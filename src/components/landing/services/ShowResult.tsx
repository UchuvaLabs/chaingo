import { useState } from "react";
import { FaClipboard } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const ShowResult = () => {
  const location = useLocation();

  const { senderContract, receiverContract } = location.state || {};
  const [isCopiedSend, setIsCopiedSend] = useState(false);
  const [isCopiedReceive, setIsCopiedReceive] = useState(false);

  const handleCopy = (text: string, setIsCopied: (state: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="bg-background p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h1 className="text-3xl font-extrabold text-accent text-center mb-8">
        Your Smart Contracts
      </h1>

      <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-primaryText mb-4">
            Send Smart Contract
          </h2>
          <div className="bg-gray-900 text-secondaryText p-6 rounded-lg shadow-inner relative">
            <pre className="whitespace-pre-wrap break-all overflow-x-auto text-sm leading-relaxed">
              <code className="text-codeHighlight">
                {senderContract || "No contract available"}
              </code>
            </pre>

            <button
              onClick={() => handleCopy(senderContract, setIsCopiedSend)}
              className={`absolute top-2 right-2 p-3 rounded-lg transition-colors hover:bg-[#d99a07] duration-300 focus:outline-none ${
                isCopiedSend ? "bg-green-500" : "bg-accent"
              }`}
            >
              <FaClipboard className="text-background" />
            </button>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-primaryText mb-4">
            Receive Smart Contract
          </h2>
          <div className="bg-gray-900 text-secondaryText p-6 rounded-lg shadow-inner relative">
            <pre className="whitespace-pre-wrap break-all overflow-x-auto text-sm leading-relaxed">
              <code className="text-codeHighlight">
                {receiverContract || "No contract available"}
              </code>
            </pre>

            <button
              onClick={() => handleCopy(receiverContract, setIsCopiedReceive)}
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
