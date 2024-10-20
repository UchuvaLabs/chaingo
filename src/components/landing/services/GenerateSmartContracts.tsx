import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

import { generateIntegrationFunction } from "../../../services/ia.toolkit";
import {
  ITeleporterMessenger,
  ITeleporterReceiver,
} from "../../../services/templates.toolkit";

const GenerateSmartContracts = () => {
  const [senderCode, setSenderCode] = useState("");
  const [receiverCode, setReceiverCode] = useState("");
  const [chainId, setChainId] = useState("");
  const [iaContext, setIaContext] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const contractStrings = [ITeleporterReceiver, ITeleporterMessenger];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { senderContract, receiverContract } =
        await generateIntegrationFunction(
          senderCode,
          receiverCode,
          iaContext,
          chainId
        );

      contractStrings.push(senderContract, receiverContract);
      downloadZip();

      navigate("/result", {
        state: { senderContract, receiverContract },
      });
    } catch (error) {
      console.error("Error generating integration:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("contracts");

    if (folder) {
      folder.file(`ITeleporterReceiver.sol`, contractStrings[0]);
      folder.file(`ITeleporterMessenger.sol`, contractStrings[1]);
      folder.file(`sender.sol`, contractStrings[2]);
      folder.file(`receiver.sol`, contractStrings[3]);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "contracts.zip");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-cardBackground rounded-lg shadow-lg">
      <h1 className="text-accent text-center font-bold text-2xl mb-6">
        Adapt your Smart Contracts
      </h1>

      <p className="text-secondaryText mb-4">
        Provide a detailed description of what you'd like to adapt, along with
        the specific smart contracts for sending and receiving interactions.
        This will help tailor your contracts for different use cases.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-primaryText text-lg font-semibold mb-2">
            What do you want to do?
          </h2>
          <textarea
            required
            className="w-full p-3 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Describe what you'd like to adapt"
            onChange={(e) => setIaContext(e.target.value)}
            rows={4}
          />
        </div>

        <hr className="border-border my-6" />

        <div className="mb-6">
          <h2 className="text-primaryText text-lg font-semibold mb-2">
            Destination Blockchain ID (HEX)
          </h2>
          <p className="text-secondaryText mb-4">
            Specify the chain ID of the destination blockchain where the smart
            contract interaction will be executed.
          </p>
          <input
            required
            type="text"
            className="w-full p-3 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            onChange={(e) => setChainId(e.target.value)}
            placeholder="Enter Destination Chain ID"
          />
        </div>

        <hr className="border-border my-6" />

        <div className="mb-6">
          <h2 className="text-primaryText text-lg font-semibold mb-2">
            Sender Smart Contract
          </h2>
          <p className="text-secondaryText mb-4">
            Paste the code of the smart contract responsible for initiating the
            transaction or action. Ensure it is clear and functional.
          </p>
          <textarea
            className="w-full p-3 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Paste your Sender Smart Contract"
            onChange={(e) => setSenderCode(e.target.value)}
            required
            rows={6}
          />
        </div>

        <hr className="border-border my-6" />

        <div className="mb-6">
          <h2 className="text-primaryText text-lg font-semibold mb-2">
            Receiver Smart Contract
          </h2>
          <p className="text-secondaryText mb-4">
            Paste the code of the smart contract that will receive or interact
            with the sender contract. This contract should handle the receiving
            side of the transaction.
          </p>
          <textarea
            className="w-full p-3 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Paste your Receiver Smart Contract"
            onChange={(e) => setReceiverCode(e.target.value)}
            required
            rows={6}
          />
        </div>

        <div className="flex justify-center">
          {loading ? (
            <button
              disabled
              type="button"
              className="px-6 py-2 bg-accent text-background font-semibold rounded-lg shadow-md inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-background animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-background font-semibold rounded-lg shadow-md hover:bg-accent/80 transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
            >
              Generate Smart Contract
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default GenerateSmartContracts;
