import { useState } from "react";
import GenerateTemplate from "./services/GenerateTemplate";
import GenerateSmartContracts from "./services/GenerateSmartContracts";

const Functions = () => {
  const [activeComponent, setActiveComponent] = useState("template");

  const handleGenerateTemplate = () => {
    setActiveComponent("template");
  };

  const handleAdapterContracts = () => {
    setActiveComponent("contracts");
  };

  return (
    <section
      id="functions"
      className="flex flex-col items-center justify-center w-full min-h-screen bg-background overflow-auto py-24"
    >
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg transition duration-300 ease-in-out ${
            activeComponent === "template"
              ? "bg-accent text-background"
              : "bg-cardBackground text-accent hover:bg-gray hover:text-primaryText"
          }`}
          onClick={handleGenerateTemplate}
        >
          Generate template
        </button>
        <button
          className={`px-6 py-2 rounded-lg transition duration-300 ease-in-out ${
            activeComponent === "contracts"
              ? "bg-accent text-background"
              : "bg-cardBackground text-secondaryText hover:bg-gray hover:text-primaryText"
          }`}
          onClick={handleAdapterContracts}
        >
          Adapt my contracts
        </button>
      </div>

      {/* Mostrar el componente activo */}
      <div className="w-full max-w-3xl">
        {activeComponent === "template" && <GenerateTemplate />}
        {activeComponent === "contracts" && <GenerateSmartContracts />}
      </div>
    </section>
  );
};

export default Functions;
