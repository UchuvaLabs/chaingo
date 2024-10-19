const GenerateSmartContracts = () => {
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

      <div className="mb-6">
        <h2 className="text-primaryText text-lg font-semibold mb-2">
          What do you want to do?
        </h2>
        <textarea
          className="w-full p-3 border border-border rounded-md bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Describe what you'd like to adapt"
          rows={4}
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
          rows={6}
        />
      </div>

      <div className="flex justify-center">
        <button className="px-6 py-2 bg-accent text-background font-semibold rounded-lg shadow-md hover:bg-accent/80 transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50">
          Generate Smart Contract
        </button>
      </div>
    </section>
  );
};

export default GenerateSmartContracts;
