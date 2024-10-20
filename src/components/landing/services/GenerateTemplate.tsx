import { useState } from "react";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";

import {
  ITeleporterMessenger,
  ITeleporterReceiver,
  generateSenderContract,
  generateReceiverContract,
} from "../../../services/templates.toolkit";
import { solidityDataTypes } from "../../../data/solidity.types";

const GenerateTemplate = () => {
  const [nameSend, setNameSend] = useState("");
  const [nameReceive, setNameReceive] = useState("");
  const [chainId, setChainId] = useState("");
  const [params, setParams] = useState([{ name: "", type: "" }]);

  const navigate = useNavigate();

  const handleAddParam = () => {
    setParams([...params, { name: "", type: "" }]);
  };

  const handleRemoveParam = (index: number) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleChange = (
    index: number,
    field: "name" | "type",
    value: string
  ) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const contractStrings = [ITeleporterReceiver, ITeleporterMessenger];

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const senderContract = generateSenderContract(nameSend, chainId, params);
    const receiverContract = generateReceiverContract(nameReceive, params);

    contractStrings.push(senderContract, receiverContract);

    downloadZip();
    navigate("/result", {
      state: { senderContract, receiverContract },
    });
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("contracts");

    if (folder) {
      folder.file(`ITeleporterReceiver.sol`, contractStrings[0]);
      folder.file(`ITeleporterMessenger.sol`, contractStrings[1]);
      folder.file(`${nameSend}-sender.sol`, contractStrings[2]);
      folder.file(`${nameReceive}-receiver.sol`, contractStrings[3]);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "contracts.zip");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-cardBackground rounded-lg shadow-lg mb-6">
      <h1 className="text-accent text-center font-bold text-2xl mb-6">
        Generate Smart Contracts
      </h1>

      <p className="text-secondaryText mb-4">
        To generate smart contracts for sending and receiving data between
        Avalanche's Layer 1 (L1) network, simply provide the names of the sender
        and receiver contracts, along with any required parameters. This will
        ensure that the contracts are tailored to your specific use case,
        enabling seamless data interaction on the Avalanche blockchain.
      </p>

      <form onSubmit={submitHandler} className="flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-primaryText block mb-1">Send</label>
            <input
              type="text"
              placeholder="Sender smart contract name"
              className="w-full p-2 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              onChange={(e) => setNameSend(e.target.value)}
              required
            />
            <p className="text-secondaryText mt-2">
              Enter the name of the smart contract responsible for sending or
              initiating the action.
            </p>
          </div>
          <div>
            <label className="text-primaryText block mb-1">Receive</label>
            <input
              type="text"
              placeholder="Receiver smart contract name"
              className="w-full p-2 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              onChange={(e) => setNameReceive(e.target.value)}
              required
            />
            <p className="text-secondaryText mt-2">
              Enter the name of the smart contract that will receive or respond
              to the sender contract.
            </p>
          </div>
        </div>

        <div>
          <label className="text-primaryText block mb-1">
            Destination Chain ID
          </label>
          <input
            type="text"
            placeholder="Enter Destination Chain ID"
            className="w-full p-2 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            onChange={(e) => setChainId(e.target.value)}
            required
          />
          <p className="text-secondaryText mt-2">
            Specify the destination blockchain network's chain ID where the
            receiver contract is located.
          </p>
        </div>

        <hr className="border-border my-4" />

        <div className="flex items-center justify-between">
          <label className="text-primaryText">Parameters</label>
          <button
            type="button"
            onClick={handleAddParam}
            className="px-4 py-2 bg-accent text-background rounded-lg text-lg font-semibold shadow-md hover:bg-accent/80 transition-all"
          >
            +
          </button>
        </div>

        <p className="text-secondaryText mb-4">
          Add any necessary parameters that will be passed between the sender
          and receiver contracts. This will define how they interact.
        </p>

        <ul className="space-y-4">
          {params.map((param, index) => (
            <li key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Parameter name"
                value={param.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="flex-grow p-2 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />

              <select
                value={param.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
                className="flex-grow p-2 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                {solidityDataTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleRemoveParam(index)}
                className="px-4 py-2 bg-error text-background rounded-lg text-lg font-semibold shadow-md hover:bg-error/80 transition-all"
              >
                -
              </button>
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="w-full py-2 bg-accent text-primaryText font-bold rounded-md hover:bg-accent/80 transition"
        >
          Generate Smart Contracts
        </button>
      </form>
    </section>
  );
};

export default GenerateTemplate;
